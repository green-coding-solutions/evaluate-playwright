from playwright.sync_api import sync_playwright
import sys
import os
from time import time_ns

HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"

def log_note(message: str) -> None:
    timestamp = str(time_ns())[:16]
    print(f"{timestamp} {message}")

def main():

    with sync_playwright() as p:
        log_note("Launch browser Firefox")
        browser = p.firefox.launch(headless=HEADLESS)

        log_note("Creating new context")
        context = browser.new_context(ignore_https_errors=True, viewport={'width': 1280, 'height': 720})

        log_note("creating new page")
        page = context.new_page()

        log_note("Visiting http://ngnix")

        response = page.goto(
            "http://ngnix",
            wait_until="domcontentloaded",
            timeout=5000
        )

        if response is None or not response.ok:
            status = response.status if response else "no response"
            raise Exception(f"Unexpected response: {status}")

        log_note("Idling for 5s")

        page.wait_for_timeout(5000)

        log_note("Closing Browser")
        browser.close()

        log_note("End")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(e)
        sys.exit(1)