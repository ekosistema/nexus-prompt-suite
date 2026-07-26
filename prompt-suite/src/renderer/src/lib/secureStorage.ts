import { invoke } from '@tauri-apps/api/core';
import { safeLog } from './utils';

const ALGORITHM = 'AES-GCM'
const KEY_DERIVATION_SALT = new Uint8Array([
    0x4e, 0x65, 0x78, 0x75, 0x73, 0x50, 0x72, 0x6f,
    0x6d, 0x70, 0x74, 0x53, 0x75, 0x69, 0x74, 0x65
])

async function getOrCreateKey(): Promise<CryptoKey> {
    try {
        const storedKey = await invoke<string>('secure_storage_get', { key: 'nexus_storage_key' });
        if (storedKey) {
            const rawKey = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0))
            return crypto.subtle.importKey('raw', rawKey, ALGORITHM, false, ['encrypt', 'decrypt'])
        }
    } catch (err) {
        safeLog('warn', 'Failed to retrieve storage key from keyring, generating new one:', err)
    }

    const key = await crypto.subtle.generateKey(
        { name: ALGORITHM, length: 256 },
        true,
        ['encrypt', 'decrypt']
    )
    const exported = await crypto.subtle.exportKey('raw', key)
    const encoded = btoa(String.fromCharCode(...new Uint8Array(exported)))

    try {
        await invoke('secure_storage_set', { key: 'nexus_storage_key', value: encoded })
    } catch (err) {
        safeLog('error', 'Failed to persist storage key to keyring:', err)
    }

    return key
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
    const stored = btoa(String.fromCharCode(...combined))
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
