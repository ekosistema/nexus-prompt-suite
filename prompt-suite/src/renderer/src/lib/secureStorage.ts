import { invoke } from '@tauri-apps/api/core';
import { safeLog } from './utils';

const ALGORITHM = 'AES-GCM'
const KEY_DERIVATION_SALT = new Uint8Array([
    0x4e, 0x65, 0x78, 0x75, 0x73, 0x50, 0x72, 0x6f,
    0x6d, 0x70, 0x74, 0x53, 0x75, 0x69, 0x74, 0x65
])

// String.fromCharCode(...bytes) revienta la pila con arrays grandes (historial), así que se convierte por bloques.
function bytesToBase64(bytes: Uint8Array): string {
    let binary = ''
    const CHUNK = 0x8000
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
    }
    return btoa(binary)
}

const KEYCHAIN_ENTRY = 'nexus_storage_key'
let keyPromise: Promise<CryptoKey> | null = null

// La clave AES vive en el llavero del sistema (nunca en localStorage). Se memoiza la promesa para
// que cargas simultáneas al arrancar no generen claves distintas.
function getOrCreateKey(): Promise<CryptoKey> {
    if (!keyPromise) {
        keyPromise = loadOrCreateKey().catch(err => {
            keyPromise = null
            throw err
        })
    }
    return keyPromise
}

async function loadOrCreateKey(): Promise<CryptoKey> {
    // Si el llavero falla (≠ "no existe") se propaga el error: crear otra clave aquí
    // sobrescribiría la buena y dejaría ilegibles los datos guardados.
    const stored = await invoke<string>('secure_storage_get', { key: KEYCHAIN_ENTRY })
    if (stored) {
        const rawKey = Uint8Array.from(atob(stored), c => c.charCodeAt(0))
        return crypto.subtle.importKey('raw', rawKey, ALGORITHM, false, ['encrypt', 'decrypt'])
    }

    const fresh = await crypto.subtle.generateKey({ name: ALGORITHM, length: 256 }, true, ['encrypt', 'decrypt'])
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', fresh))
    await invoke('secure_storage_set', { key: KEYCHAIN_ENTRY, value: bytesToBase64(raw) })
    // Se reimporta como no extraíble: tras guardarla ya no hace falta poder exportarla.
    return crypto.subtle.importKey('raw', raw, ALGORITHM, false, ['encrypt', 'decrypt'])
}

export async function secureSetItem(key: string, value: unknown): Promise<void> {
    const cryptoKey = await getOrCreateKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(JSON.stringify(value))
    const encrypted = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        cryptoKey,
        encoded
    )
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    const stored = bytesToBase64(combined)
    localStorage.setItem(key, stored)
}

export async function secureGetItem<T>(key: string): Promise<T | null> {
    const stored = localStorage.getItem(key)
    if (!stored) return null

    try {
        const cryptoKey = await getOrCreateKey()
        const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0))
        const iv = combined.slice(0, 12)
        const encrypted = combined.slice(12)
        const decrypted = await crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            cryptoKey,
            encrypted
        )
        return JSON.parse(new TextDecoder().decode(decrypted))
    } catch {
        safeLog('warn', 'Failed to decrypt stored item, returning null to prevent plaintext fallback')
        return null
    }
}

export async function secureRemoveItem(key: string): Promise<void> {
    localStorage.removeItem(key)
}
