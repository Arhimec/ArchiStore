import { test, expect } from '@playwright/test';

test.describe('ArchiStore Architectural Stock Plan E2E Journey', () => {
  test('Complete User Journey: Catalog search -> PDP legal disclaimer gate -> Checkout -> Token Download -> 403 Forbidden check', async ({ page, request }) => {
    test.setTimeout(90000);

    // Capture console errors for debugging
    page.on('console', (msg) => {
      console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`);
    });

    // 1. Visit Catalog Page
    await page.goto('/catalog');
    await expect(page.locator('h3:has-text("The Fairview Modern Farmhouse")').first()).toBeVisible();

    // 2. Filter catalog by Sq Ft
    await page.fill('input[placeholder*="Search"]', 'Fairview');
    await expect(page.locator('h3:has-text("The Fairview Modern Farmhouse")')).toBeVisible();

    // 3. Navigate to Product Detail Page (PDP)
    await page.click('a:has-text("View Plan Details") >> nth=0');
    await expect(page.locator('h1')).toContainText('Fairview');

    // 4. Verify Technical Specs Table is present
    await expect(page.locator('text=TECHNICAL SPECIFICATIONS')).toBeVisible();
    await expect(page.locator('text=2450 SQ FT')).toBeVisible();

    // 5. Verify Sample PDF Download button is present
    const sampleDownloadBtn = page.locator('a:has-text("Download Sample PDF")');
    await expect(sampleDownloadBtn).toBeVisible();

    // 6. Verify Buy Button is DISABLED when legal checkbox is unchecked
    const buyButton = page.locator('button[type="submit"]');
    await expect(buyButton).toBeDisabled();
    await expect(buyButton).toContainText('Check License Disclaimer to Buy');

    // 7. Fill Email & Check Mandatory Legal Disclaimer Checkbox
    await page.fill('input[type="email"]', 'architect_test@example.com');
    await page.click('button#legal-disclaimer-checkbox');

    // 8. Verify Buy Button is now ENABLED
    await expect(buyButton).toBeEnabled();
    await expect(buyButton).toContainText('Buy Now');

    // 9. Submit Checkout
    await buyButton.click();

    // 10. Verify redirect to Order Confirmation Page
    await page.waitForURL((url) => url.href.includes('/checkout/success'), { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed', { timeout: 30000 });

    // 11. Extract Signed Download URL from Order Success Page
    const downloadLinkLocator = page.locator('a:has-text("Download Construction PDF Package")');
    await expect(downloadLinkLocator).toBeVisible({ timeout: 30000 });

    const signedDownloadHref = await downloadLinkLocator.getAttribute('href');
    expect(signedDownloadHref).toBeTruthy();
    expect(signedDownloadHref).toContain('/api/downloads/');

    // 12. Test HTTP Download Request via signed link -> Expect 200 OK & PDF Content-Type
    const downloadResponse = await request.get(signedDownloadHref!);
    expect(downloadResponse.status()).toBe(200);
    expect(downloadResponse.headers()['content-type']).toBe('application/pdf');

    const pdfBuffer = await downloadResponse.body();
    expect(pdfBuffer.length).toBeGreaterThan(500); // Valid PDF payload

    // 13. Security Verification: Attempt download using a tampered or expired token -> Expect 403 Forbidden
    const tamperedResponse = await request.get('/api/downloads/invalid_tampered_token_xyz_123');
    expect(tamperedResponse.status()).toBe(403);
    const tamperedJson = await tamperedResponse.json();
    expect(tamperedJson.status).toBe('INVALID_SIGNATURE');
  });
});
