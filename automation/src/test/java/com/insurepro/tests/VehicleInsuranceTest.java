
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

public class VehicleInsuranceTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5175";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // Open frontend first
        driver.get(baseUrl);

        // Create demo customer session
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

        // Open Vehicle Insurance page
        driver.get(baseUrl + "/vehicle-insurance");

        wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[normalize-space()='Protect Your Journey']")
            )
        );
    }

    // TEST 1: Verify Vehicle Insurance page loads

    @Test(priority = 1)
    public void verifyVehicleInsurancePageLoads() {

        Assert.assertTrue(
            driver.getCurrentUrl().contains("/vehicle-insurance"),
            "Vehicle Insurance URL is incorrect"
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h1[normalize-space()='Protect Your Journey']")
            ).isDisplayed(),
            "Vehicle Insurance heading is missing"
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h2[normalize-space()='Choose Your Vehicle Insurance']")
            ).isDisplayed(),
            "Insurance section heading is missing"
        );

        System.out.println("Vehicle Insurance Page Test PASSED!");
    }

    // TEST 2: Verify Car and Bike insurance plans

    @Test(priority = 2)
    public void verifyCarAndBikeInsurancePlans() {

        // Verify three Car plans
        List<WebElement> carPlans = driver.findElements(
            By.cssSelector(".vehicle-plan-card")
        );

        Assert.assertEquals(
            carPlans.size(),
            3,
            "Three Car Insurance plans should be displayed"
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h3[normalize-space()='Car Basic']")
            ).isDisplayed()
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h3[normalize-space()='Car Plus']")
            ).isDisplayed()
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h3[normalize-space()='Car Premium']")
            ).isDisplayed()
        );

        // Click Bike Insurance
        driver.findElement(
            By.xpath("//button[contains(.,'Bike Insurance')]")
        ).click();

        // Verify three Bike plans
        List<WebElement> bikePlans = driver.findElements(
            By.cssSelector(".vehicle-plan-card")
        );

        Assert.assertEquals(
            bikePlans.size(),
            3,
            "Three Bike Insurance plans should be displayed"
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h3[normalize-space()='Bike Basic']")
            ).isDisplayed()
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h3[normalize-space()='Bike Plus']")
            ).isDisplayed()
        );

        Assert.assertTrue(
            driver.findElement(
                By.xpath("//h3[normalize-space()='Bike Premium']")
            ).isDisplayed()
        );

        System.out.println("Car and Bike Plans Test PASSED!");
    }

    // TEST 3: Verify coverage and premium amounts

    @Test(priority = 3)
    public void verifyVehicleCoverageAndPremiums() {

        String pageText = driver.findElement(
            By.tagName("body")
        ).getText();

        // Verify Car plan coverage
        Assert.assertTrue(pageText.contains("₹3,00,000"));
        Assert.assertTrue(pageText.contains("₹5,00,000"));
        Assert.assertTrue(pageText.contains("₹10,00,000"));

        // Verify Car premiums
        Assert.assertTrue(pageText.contains("4,500"));
        Assert.assertTrue(pageText.contains("7,500"));
        Assert.assertTrue(pageText.contains("12,000"));

        // Switch to Bike Insurance
        driver.findElement(
            By.xpath("//button[contains(.,'Bike Insurance')]")
        ).click();

        pageText = driver.findElement(
            By.tagName("body")
        ).getText();

        // Verify Bike coverage
        Assert.assertTrue(pageText.contains("₹1,00,000"));
        Assert.assertTrue(pageText.contains("₹2,00,000"));
        Assert.assertTrue(pageText.contains("₹3,00,000"));

        // Verify Bike premiums
        Assert.assertTrue(pageText.contains("1,500"));
        Assert.assertTrue(pageText.contains("2,500"));
        Assert.assertTrue(pageText.contains("3,500"));

        System.out.println("Vehicle Coverage and Premium Test PASSED!");
    }

    // TEST 4: Verify selecting a plan and opening payment

    @Test(priority = 4)
    public void verifySelectPlanAndContinueToPayment() {

        // Select Car Plus
        WebElement carPlusCard = driver.findElement(
            By.xpath(
                "//div[contains(@class,'vehicle-plan-card')]" +
                "[.//h3[normalize-space()='Car Plus']]"
            )
        );

        carPlusCard.findElement(
            By.cssSelector(".vehicle-select-btn")
        ).click();

        // Verify selected plan summary
        WebElement summary = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".vehicle-selection-summary")
            )
        );

        Assert.assertTrue(
            summary.getText().contains("Car Plus"),
            "Selected plan name is incorrect"
        );

        Assert.assertTrue(
            summary.getText().contains("₹5,00,000"),
            "Selected coverage is incorrect"
        );

        Assert.assertTrue(
            summary.getText().contains("₹7,500"),
            "Selected premium is incorrect"
        );

        // Continue to payment
        summary.findElement(
            By.cssSelector(".vehicle-pay-btn")
        ).click();

        // Verify payment modal
        WebElement paymentModal = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".vehicle-payment-modal")
            )
        );

        String modalText = paymentModal.getText();

        Assert.assertTrue(
            modalText.contains("Complete Your Payment")
        );

        Assert.assertTrue(
            modalText.contains("Car Plus")
        );

        Assert.assertTrue(
            modalText.contains("₹7,500")
        );

        Assert.assertTrue(
            modalText.contains("No real money will be charged")
        );

        System.out.println("Select Plan and Payment Test PASSED!");
    }

    // TEST 5: Verify payment methods and close button

    @Test(priority = 5)
    public void verifyPaymentMethodsAndCloseButton() {

        // Switch to Bike Insurance
        driver.findElement(
            By.xpath("//button[contains(.,'Bike Insurance')]")
        ).click();

        // Select Bike Basic
        WebElement bikeBasicCard = driver.findElement(
            By.xpath(
                "//div[contains(@class,'vehicle-plan-card')]" +
                "[.//h3[normalize-space()='Bike Basic']]"
            )
        );

        bikeBasicCard.findElement(
            By.cssSelector(".vehicle-select-btn")
        ).click();

        // Continue to payment
        WebElement summary = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".vehicle-selection-summary")
            )
        );

        summary.findElement(
            By.cssSelector(".vehicle-pay-btn")
        ).click();

        WebElement paymentModal = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".vehicle-payment-modal")
            )
        );

        // Verify three payment methods
        List<WebElement> paymentOptions = paymentModal.findElements(
            By.cssSelector("input[name='payment']")
        );

        Assert.assertEquals(
            paymentOptions.size(),
            3,
            "Three payment methods should be available"
        );

        // Select Credit/Debit Card
        WebElement cardOption = driver.findElement(
            By.cssSelector(
                "input[name='payment'][value='Credit/Debit Card']"
            )
        );

        cardOption.click();

        Assert.assertTrue(
            cardOption.isSelected(),
            "Credit/Debit Card was not selected"
        );

        // Select Net Banking
        WebElement netBankingOption = driver.findElement(
            By.cssSelector(
                "input[name='payment'][value='Net Banking']"
            )
        );

        netBankingOption.click();

        Assert.assertTrue(
            netBankingOption.isSelected(),
            "Net Banking was not selected"
        );

        // Close payment modal without purchasing
        driver.findElement(
            By.cssSelector(".vehicle-close-btn")
        ).click();

        wait.until(
            ExpectedConditions.invisibilityOfElementLocated(
                By.cssSelector(".vehicle-payment-modal")
            )
        );

        // Verify selected plan summary is visible again
        Assert.assertTrue(
            driver.findElement(
                By.cssSelector(".vehicle-selection-summary")
            ).isDisplayed(),
            "Selected plan summary should be visible"
        );

        System.out.println("Payment Methods and Close Button Test PASSED!");
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
