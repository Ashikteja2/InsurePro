
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;

public class PaymentsTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5175";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        driver.get(baseUrl);

        JavascriptExecutor js = (JavascriptExecutor) driver;

        // Create logged-in customer
        js.executeScript(
            "localStorage.setItem('insureproCustomer', JSON.stringify({" +
            "customerId: 7," +
            "id: 7," +
            "fullName: 'InsurePro Test User'," +
            "email: 'insureprotest20261112014952@gmail.com'," +
            "phone: '9876543210'" +
            "}));"
        );

        // Create demo policy for payment testing
        js.executeScript(
            "localStorage.setItem('insureproPolicies', JSON.stringify([" +
            "{" +
            "id: 101," +
            "customerId: 7," +
            "policyNumber: 'INS-TEST-101'," +
            "name: 'Health Insurance'," +
            "type: 'Health'," +
            "premium: 15000," +
            "purchaseDate: '2026-11-16'," +
            "status: 'Active'" +
            "}" +
            "]));"
        );

        driver.get(baseUrl + "/payments");
    }

    @Test
    public void verifyPaymentsPageLoads() {

        WebElement heading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[normalize-space()='Payment History']")
            )
        );

        Assert.assertTrue(heading.isDisplayed());

        Assert.assertTrue(
            driver.getCurrentUrl().contains("/payments")
        );

        System.out.println("Payments Page Test PASSED");
    }

    @Test
    public void verifyTotalRecordedPayments() {

        WebElement heading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h3[normalize-space()='Total Recorded Payments']")
            )
        );

        Assert.assertTrue(heading.isDisplayed());

        WebElement amount = driver.findElement(
            By.xpath("//h3[normalize-space()='Total Recorded Payments']/following-sibling::div")
        );

        Assert.assertTrue(amount.isDisplayed());

        Assert.assertTrue(
            amount.getText().contains("₹"),
            "Total payment amount should contain rupee symbol"
        );

        Assert.assertTrue(
            amount.getText().contains("15,000"),
            "Expected demo premium amount was not displayed"
        );

        System.out.println(
            "Total Recorded Payments: " + amount.getText()
        );

        System.out.println("Total Recorded Payments Test PASSED");
    }

    @Test
    public void verifyPaymentHistoryTable() {

        WebElement historyHeading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h2[normalize-space()='Payment Records']")
            )
        );

        Assert.assertTrue(historyHeading.isDisplayed());

        String[] expectedHeaders = {
            "Payment / Policy ID",
            "Policy Type",
            "Amount",
            "Date",
            "Status"
        };

        for (String header : expectedHeaders) {

            WebElement headerElement = driver.findElement(
                By.xpath("//th[normalize-space()='" + header + "']")
            );

            Assert.assertTrue(
                headerElement.isDisplayed(),
                "Missing table header: " + header
            );
        }

        List<WebElement> rows = driver.findElements(
            By.cssSelector("tbody tr")
        );

        Assert.assertTrue(
            rows.size() > 0,
            "No payment records found"
        );

        System.out.println(
            "Payment History Table Test PASSED"
        );

        System.out.println(
            "Payment Records Found: " + rows.size()
        );
    }

    @Test
    public void verifyPaymentRecordDetails() {

        WebElement firstRow = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("tbody tr")
            )
        );

        List<WebElement> columns = firstRow.findElements(
            By.tagName("td")
        );

        Assert.assertEquals(
            columns.size(),
            5,
            "Payment record should contain 5 columns"
        );

        Assert.assertFalse(
            columns.get(0).getText().trim().isEmpty(),
            "Policy ID is missing"
        );

        Assert.assertFalse(
            columns.get(1).getText().trim().isEmpty(),
            "Policy type is missing"
        );

        Assert.assertTrue(
            columns.get(2).getText().contains("₹"),
            "Payment amount is missing"
        );

        Assert.assertFalse(
            columns.get(3).getText().trim().isEmpty(),
            "Payment date is missing"
        );

        Assert.assertFalse(
            columns.get(4).getText().trim().isEmpty(),
            "Payment status is missing"
        );

        System.out.println("Payment Record Details Test PASSED");

        System.out.println(
            "Policy ID: " + columns.get(0).getText()
        );

        System.out.println(
            "Policy Type: " + columns.get(1).getText()
        );

        System.out.println(
            "Amount: " + columns.get(2).getText()
        );

        System.out.println(
            "Status: " + columns.get(4).getText()
        );
    }

    @Test
    public void verifyPaymentInformationNotice() {

        WebElement note = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath(
                    "//p[contains(text(),'Demo application: no real payment is collected or processed.')]"
                )
            )
        );

        Assert.assertTrue(note.isDisplayed());

        System.out.println(
            "Payment Information Notice Test PASSED"
        );
    }

    @Test
    public void verifyLoginRequiredMessage() {

        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
            "localStorage.removeItem('insureproCustomer');"
        );

        driver.get(baseUrl + "/payments");

        wait.until(
            ExpectedConditions.urlContains("/login")
        );

        Assert.assertTrue(
            driver.getCurrentUrl().contains("/login"),
            "User should be redirected to login page"
        );

        System.out.println(
            "Login Required Validation Test PASSED"
        );
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
