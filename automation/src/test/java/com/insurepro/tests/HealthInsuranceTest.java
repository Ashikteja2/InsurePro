
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class HealthInsuranceTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5175";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // Open frontend first so localStorage is available
        driver.get(baseUrl);

        // Create a demo logged-in customer session
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

        // Open Health Insurance page
        driver.get(baseUrl + "/health-insurance");

        wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[normalize-space()='Health Insurance Plans']")
            )
        );
    }

    // TEST 1: Verify Health Insurance page loads

    @Test(priority = 1)
    public void verifyHealthInsurancePageLoads() {

        String currentUrl = driver.getCurrentUrl();

        Assert.assertTrue(
            currentUrl.contains("/health-insurance"),
            "Health Insurance page URL is incorrect"
        );

        WebElement heading = driver.findElement(
            By.xpath("//h1[normalize-space()='Health Insurance Plans']")
        );

        Assert.assertTrue(
            heading.isDisplayed(),
            "Health Insurance heading is not displayed"
        );

        System.out.println("Health Insurance Page Test PASSED!");
    }

    // TEST 2: Verify all three insurance plans

    @Test(priority = 2)
    public void verifyInsurancePlans() {

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h2[normalize-space()='Health Basic']")
            ).isDisplayed()
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h2[normalize-space()='Health Plus']")
            ).isDisplayed()
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h2[normalize-space()='Health Premium']")
            ).isDisplayed()
        );

        System.out.println("All Three Insurance Plans Test PASSED!");
    }

    // TEST 3: Verify coverage and annual premiums

    @Test(priority = 3)
    public void verifyPlanCoverageAndPremiums() {

        String pageText = driver.findElement(By.tagName("body")).getText();

        Assert.assertTrue(
            pageText.contains("₹5 Lakhs"),
            "Health Basic coverage not found"
        );

        Assert.assertTrue(
            pageText.contains("₹10 Lakhs"),
            "Health Plus coverage not found"
        );

        Assert.assertTrue(
            pageText.contains("₹25 Lakhs"),
            "Health Premium coverage not found"
        );

        Assert.assertTrue(
            pageText.contains("6,500"),
            "Health Basic premium not found"
        );

        Assert.assertTrue(
            pageText.contains("9,500"),
            "Health Plus premium not found"
        );

        Assert.assertTrue(
            pageText.contains("14,500"),
            "Health Premium premium not found"
        );

        Assert.assertTrue(
            pageText.contains("illustrative"),
            "Illustrative premium label not found"
        );

        System.out.println("Coverage and Premium Test PASSED!");
    }

    // TEST 4: Verify choosing a plan opens the demo payment modal

    @Test(priority = 4)
    public void verifyChoosePlanAndPaymentModal() {

        WebElement chooseButton = driver.findElement(
            By.xpath(
                "//div[.//h2[normalize-space()='Health Plus']]" +
                "//button[contains(.,'Choose This Plan')]"
            )
        );

        chooseButton.click();

        WebElement modalHeading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h2[normalize-space()='Demo Payment']")
            )
        );

        Assert.assertTrue(
            modalHeading.isDisplayed(),
            "Demo Payment modal did not open"
        );

        String modalText = driver.findElement(By.tagName("body")).getText();

        Assert.assertTrue(
            modalText.contains("Health Plus"),
            "Selected plan name is incorrect"
        );

        Assert.assertTrue(
            modalText.contains("₹10 Lakhs"),
            "Selected coverage is incorrect"
        );

        Assert.assertTrue(
            modalText.contains("₹9,500"),
            "Selected premium is incorrect"
        );

        Assert.assertTrue(
            modalText.contains("No real payment will be processed"),
            "Demo payment notice is missing"
        );

        System.out.println("Choose Plan and Payment Modal Test PASSED!");
    }

    // TEST 5: Verify payment method options and Back button

    @Test(priority = 5)
    public void verifyPaymentMethodsAndBackButton() {

        WebElement chooseButton = driver.findElement(
            By.xpath(
                "//div[.//h2[normalize-space()='Health Basic']]" +
                "//button[contains(.,'Choose This Plan')]"
            )
        );

        chooseButton.click();

        wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h2[normalize-space()='Demo Payment']")
            )
        );

        WebElement paymentDropdown = driver.findElement(
            By.tagName("select")
        );

        Select paymentSelect = new Select(paymentDropdown);

        Assert.assertEquals(
            paymentSelect.getOptions().size(),
            3,
            "Payment method options count is incorrect"
        );

        paymentSelect.selectByVisibleText("Credit/Debit Card");

        Assert.assertEquals(
            paymentSelect.getFirstSelectedOption().getText(),
            "Credit/Debit Card"
        );

        paymentSelect.selectByVisibleText("Net Banking");

        Assert.assertEquals(
            paymentSelect.getFirstSelectedOption().getText(),
            "Net Banking"
        );

        // Click Back without making a purchase
        WebElement backButton = driver.findElement(
            By.xpath("//button[normalize-space()='Back']")
        );

        backButton.click();

        wait.until(
            ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//h2[normalize-space()='Demo Payment']")
            )
        );

        // Confirm the plans are visible again
        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h2[normalize-space()='Health Basic']")
            ).isDisplayed()
        );

        System.out.println("Payment Methods and Back Button Test PASSED!");
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
