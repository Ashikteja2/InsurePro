
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;
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

    String baseUrl = "http://localhost:5176";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // Open application
        driver.get(baseUrl);

        // Create demo logged-in customer session
        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
                "localStorage.setItem('insureproCustomer', JSON.stringify({" +
                        "customerId: 7," +
                        "id: 7," +
                        "fullName: 'InsurePro Test User'," +
                        "email: 'insureprotest20261112014952@gmail.com'," +
                        "phone: '9876543210'" +
                        "}));"
        );

        // Open Payments page
        driver.get(baseUrl + "/payments");

        // Wait until payment records finish loading
        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath("//*[contains(text(),'Loading payment records...')]")
                )
        );
    }

    @Test
    public void verifyPaymentsPageLoads() {

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//h1[text()='Payments']")
                )
        );

        Assert.assertEquals(
                heading.getText(),
                "Payments"
        );

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/payments")
        );

        System.out.println("Payments Page Test PASSED");
    }

    @Test
    public void verifyPaymentsSummaryCards() {

        // Total Policies
        WebElement totalPolicies = driver.findElement(
                By.xpath(
                        "//span[text()='Total Policies']/following-sibling::h2"
                )
        );

        // Total Premium Amount
        WebElement totalPremium = driver.findElement(
                By.xpath(
                        "//span[text()='Total Premium Amount']/following-sibling::h2"
                )
        );

        // Active Policies
        WebElement activePolicies = driver.findElement(
                By.xpath(
                        "//span[text()='Active Policies']/following-sibling::h2"
                )
        );

        Assert.assertTrue(totalPolicies.isDisplayed());
        Assert.assertTrue(totalPremium.isDisplayed());
        Assert.assertTrue(activePolicies.isDisplayed());

        Assert.assertTrue(
                totalPolicies.getText().matches("\\d+")
        );

        Assert.assertTrue(
                totalPremium.getText().contains("₹")
        );

        Assert.assertTrue(
                activePolicies.getText().matches("\\d+")
        );

        System.out.println("Payments Summary Cards Test PASSED");

        System.out.println(
                "Total Policies: " + totalPolicies.getText()
        );

        System.out.println(
                "Total Premium: " + totalPremium.getText()
        );

        System.out.println(
                "Active Policies: " + activePolicies.getText()
        );
    }

    @Test
    public void verifyPaymentHistoryTable() {

        WebElement historyHeading = driver.findElement(
                By.xpath("//h2[text()='Payment History']")
        );

        Assert.assertTrue(historyHeading.isDisplayed());

        // Verify table headers
        String[] expectedHeaders = {
                "Policy Number",
                "Policy Name",
                "Type",
                "Premium",
                "Purchase Date",
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

        // Verify at least one policy record exists
        List<WebElement> rows = driver.findElements(
                By.cssSelector("tbody tr")
        );

        Assert.assertTrue(
                rows.size() > 0,
                "No policy records found in payment history"
        );

        System.out.println("Payment History Table Test PASSED");
        System.out.println("Payment Records Found: " + rows.size());
    }

    @Test
    public void verifyPaymentRecordDetails() {

        // Wait for the first policy record
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
                6,
                "Payment record should contain 6 columns"
        );

        // Policy number should not be empty
        Assert.assertFalse(
                columns.get(0).getText().trim().isEmpty(),
                "Policy number is missing"
        );

        // Policy name should not be empty
        Assert.assertFalse(
                columns.get(1).getText().trim().isEmpty(),
                "Policy name is missing"
        );

        // Premium should contain rupee symbol
        Assert.assertTrue(
                columns.get(3).getText().contains("₹"),
                "Premium amount is missing"
        );

        // Purchase date should not be empty
        Assert.assertFalse(
                columns.get(4).getText().trim().isEmpty(),
                "Purchase date is missing"
        );

        // Status should not be empty
        Assert.assertFalse(
                columns.get(5).getText().trim().isEmpty(),
                "Policy status is missing"
        );

        System.out.println("Payment Record Details Test PASSED");

        System.out.println(
                "Policy Number: " + columns.get(0).getText()
        );

        System.out.println(
                "Policy Name: " + columns.get(1).getText()
        );

        System.out.println(
                "Premium: " + columns.get(3).getText()
        );

        System.out.println(
                "Status: " + columns.get(5).getText()
        );
    }

    @Test
    public void verifyPaymentInformationNotice() {

        WebElement note = driver.findElement(
                By.xpath(
                        "//p[contains(text(),'Payment records are based on saved policies')]"
                )
        );

        Assert.assertTrue(note.isDisplayed());

        Assert.assertTrue(
                note.getText().contains(
                        "No real payment is processed"
                )
        );

        System.out.println("Payment Information Notice Test PASSED");
    }

    @Test
    public void verifyLoginRequiredMessage() {

        // Remove customer session
        driver.get(baseUrl);

        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
                "localStorage.removeItem('insureproCustomer');"
        );

        // Open Payments page without login
        driver.get(baseUrl + "/payments");

        // Wait for error message
        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//p[contains(text(),'Please login to view your payments.')]"
                        )
                )
        );

        Assert.assertTrue(
                errorMessage.getText().contains(
                        "Please login to view your payments."
                )
        );

        System.out.println("Login Required Validation Test PASSED");
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
