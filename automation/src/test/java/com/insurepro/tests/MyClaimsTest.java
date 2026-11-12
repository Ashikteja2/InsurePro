
package com.insurepro.tests;

import org.openqa.selenium.By;
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

public class MyClaimsTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5176";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        // Open the application first
        driver.get(baseUrl);

        // Create a demo logged-in customer session
        ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript(
                        "localStorage.setItem('insureproCustomer', JSON.stringify({" +
                                "customerId: 7," +
                                "id: 7," +
                                "fullName: 'InsurePro Test User'," +
                                "email: 'insureprotest20261112014952@gmail.com'," +
                                "phone: '9876543210'" +
                                "}));"
                );

        // Clear old demo claims before each test
        ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript(
                        "localStorage.removeItem('insureproClaims');"
                );

        // Open My Claims page
        driver.get(baseUrl + "/my-claims");

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[contains(text(),'My Claims')]")
        ));
    }

    @Test
    public void verifyMyClaimsPageLoads() {

        String heading = driver.findElement(
                By.xpath("//h1[contains(text(),'My Claims')]")
        ).getText();

        Assert.assertEquals(heading, "My Claims");

        System.out.println("My Claims Page Test PASSED");
    }

    @Test
    public void verifyClaimFormFields() {

        Assert.assertTrue(
                driver.findElement(By.name("policyNumber")).isDisplayed()
        );

        Assert.assertTrue(
                driver.findElement(By.name("claimType")).isDisplayed()
        );

        Assert.assertTrue(
                driver.findElement(By.name("amount")).isDisplayed()
        );

        Assert.assertTrue(
                driver.findElement(By.name("description")).isDisplayed()
        );

        System.out.println("Claim Form Fields Test PASSED");
    }

    @Test
    public void verifyClaimTypeDropdownOptions() {

        WebElement dropdown = driver.findElement(
                By.name("claimType")
        );

        Select select = new Select(dropdown);

        Assert.assertTrue(select.getOptions().size() >= 5);

        select.selectByVisibleText("Hospitalization");

        Assert.assertEquals(
                select.getFirstSelectedOption().getText(),
                "Hospitalization"
        );

        System.out.println("Claim Type Dropdown Test PASSED");
    }

    @Test
    public void verifySuccessfulClaimSubmission() {

        // Enter policy number
        driver.findElement(By.name("policyNumber"))
                .sendKeys("INS-HEALTH-269870F6");

        // Select claim type
        Select claimType = new Select(
                driver.findElement(By.name("claimType"))
        );

        claimType.selectByVisibleText("Hospitalization");

        // Enter claim amount
        driver.findElement(By.name("amount"))
                .sendKeys("20000");

        // Enter description
        driver.findElement(By.name("description"))
                .sendKeys("Selenium demo hospitalization claim");

        // Click submit button
        driver.findElement(
                By.xpath("//button[contains(text(),'Submit Demo Claim')]")
        ).click();

        // IMPORTANT:
        // The React component displays the message inside a <p> element.
        // It does not have a CSS class named "message".
        WebElement message = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//p[contains(text(),'Demo claim submitted')]")
                )
        );

        Assert.assertTrue(
                message.getText().contains("Demo claim submitted")
        );

        Assert.assertTrue(
                message.getText().contains("CLM-")
        );

        // Verify Total Claims increased to 1
        WebElement totalClaims = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[text()='Total Claims']/following-sibling::strong"
                        )
                )
        );

        Assert.assertEquals(totalClaims.getText().trim(), "1");

        // Verify claim appears in history
        Assert.assertTrue(
                driver.getPageSource().contains(
                        "INS-HEALTH-269870F6"
                )
        );

        System.out.println("Successful Claim Submission Test PASSED");
        System.out.println("Claim Message: " + message.getText());
        System.out.println("Total Claims: " + totalClaims.getText());
    }

    @Test
    public void verifyRequiredFieldValidation() {

        // Try submitting the form without entering any details
        driver.findElement(
                By.xpath("//button[contains(text(),'Submit Demo Claim')]")
        ).click();

        // Browser should prevent submission because required fields are empty
        WebElement policyNumber = driver.findElement(
                By.name("policyNumber")
        );

        Boolean isValid = (Boolean)
                ((org.openqa.selenium.JavascriptExecutor) driver)
                        .executeScript(
                                "return arguments[0].checkValidity();",
                                policyNumber
                        );

        Assert.assertFalse(
                isValid,
                "Policy number should be required"
        );

        System.out.println("Required Field Validation Test PASSED");
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
