use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

const AI_RATE_LIMIT_MAX: u32 = 30;
const AI_RATE_LIMIT_WINDOW_SECS: u64 = 60;
const AI_CONCURRENT_LIMIT: usize = 3;

static RATE_LIMIT_STATE: Mutex<Option<RateLimiter>> = Mutex::new(None);

pub struct RateLimiter {
    windows: HashMap<String, (Instant, u32)>,
    concurrent: usize,
}

impl RateLimiter {
    fn check_and_consume(&mut self, key: &str) -> Result<(), String> {
        let now = Instant::now();
        let window = Duration::from_secs(AI_RATE_LIMIT_WINDOW_SECS);

        let (start, count) = self.windows.entry(key.to_string()).or_insert((now, 0));

        if now.duration_since(*start) > window {
            *start = now;
            *count = 0;
        }

        if *count >= AI_RATE_LIMIT_MAX {
            return Err(format!(
                "Rate limit exceeded: {} requests per {}s. Please wait.",
                AI_RATE_LIMIT_MAX, AI_RATE_LIMIT_WINDOW_SECS
            ));
        }

        if self.concurrent >= AI_CONCURRENT_LIMIT {
            return Err(
                "Too many concurrent AI requests. Please wait for ongoing requests to complete."
                    .into(),
            );
        }

        *count += 1;
        self.concurrent += 1;
        Ok(())
    }

    fn release(&mut self) {
        if self.concurrent > 0 {
            self.concurrent -= 1;
        }
    }
}

fn get_rate_limiter() -> &'static Mutex<Option<RateLimiter>> {
    let mut state = RATE_LIMIT_STATE
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    if state.is_none() {
        *state = Some(RateLimiter {
            windows: HashMap::new(),
            concurrent: 0,
        });
    }
    drop(state);
    &RATE_LIMIT_STATE
}

fn check_rate_limit(cmd: &str) -> Result<(), String> {
    let mut state = get_rate_limiter()
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    if let Some(ref mut limiter) = *state {
        limiter.check_and_consume(cmd)
    } else {
        Ok(())
    }
}

fn release_rate_limit() {
    if let Ok(mut state) = get_rate_limiter().lock() {
        if let Some(ref mut limiter) = *state {
            limiter.release();
        }
    }
}

pub struct RateLimitGuard {
    acquired: bool,
}

impl RateLimitGuard {
    pub fn acquire(cmd: &str) -> Result<Self, String> {
        check_rate_limit(cmd)?;
        Ok(Self { acquired: true })
    }
}

impl Drop for RateLimitGuard {
    fn drop(&mut self) {
        if self.acquired {
            release_rate_limit();
        }
    }
}
