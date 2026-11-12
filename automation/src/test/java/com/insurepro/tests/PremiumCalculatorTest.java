
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class PremiumCalculatorTest {

    WebDriver driver;
    WebDriverWait wait;
String baseUrl = "http://localhost:5176";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(20)
        );

        driver.get(baseUrl + "/premium-calculator");

        wait.until(d ->
                d.findElement(By.tagName("h1")).isDisplayed()
        );
    }

    // Test 1: Verify Premium Calculator page loads

    @Test
    public void verifyPremiumCalculatorPageLoads() {

        WebElement heading = driver.findElement(
                By.xpath("//h1[text()='Premium Calculator']")
        );

        Assert.assertTrue(
                heading.isDisplayed(),
                "Premium Calculator heading should be displayed"
        );

        Assert.assertTrue(
                driver.findElement(
                        By.xpath("//button[text()='Calculate Premium']")
                ).isDisplayed(),
                "Calculate Premium button should be displayed"
        );

        System.out.println(
                "Premium Calculator Page Test PASSED"
        );
    }

    // Test 2: Health Insurance calculation

    @Test
    public void verifyHealthPremiumCalculation() {

        Select coverage = new Select(
                driver.findElement(By.id("coverage"))
        );

        coverage.selectByValue("500000");

        Select duration = new Select(
                driver.findElement(By.id("duration"))
        );

        duration.selectByValue("1");

        driver.findElement(
                By.xpath("//button[text()='Calculate Premium']")
        ).click();

        WebElement result = wait.until(d ->
                d.findElement(
                        By.xpath("//h1[text()='₹6,500']")
                )
        );

        Assert.assertTrue(result.isDisplayed());

        System.out.println(
                "Health Premium Calculation Test PASSED: ₹6,500"
        );
    }

    // Test 3: Car Insurance calculation

    @Test
    public void verifyCarPremiumCalculation() {

        Select insurance = new Select(
                driver.findElement(By.id("insuranceType"))
        );

        insurance.selectByValue("Car");

        Select coverage = new Select(
                driver.findElement(By.id("coverage"))
        );

        coverage.selectByValue("300000");

        Select duration = new Select(
                driver.findElement(By.id("duration"))
        );

        duration.selectByValue("2");

        driver.findElement(By.id("age")).clear();
        driver.findElement(By.id("age")).sendKeys("30");

        driver.findElement(
                By.xpath("//button[text()='Calculate Premium']")
        ).click();

        WebElement result = wait.until(d ->
                d.findElement(
                        By.xpath("//h1[text()='₹15,000']")
                )
        );

        Assert.assertTrue(result.isDisplayed());

        System.out.println(
                "Car Premium Calculation Test PASSED: ₹15,000"
        );
    }

    // Test 4: Bike Insurance calculation

    @Test
    public void verifyBikePremiumCalculation() {

        Select insurance = new Select(
                driver.findElement(By.id("insuranceType"))
        );

        insurance.selectByValue("Bike");

        Select coverage = new Select(
                driver.findElement(By.id("coverage"))
        );

        coverage.selectByValue("100000");

        Select duration = new Select(
                driver.findElement(By.id("duration"))
        );

        duration.selectByValue("3");

        driver.findElement(By.id("age")).clear();
        driver.findElement(By.id("age")).sendKeys("30");

        driver.findElement(
                By.xpath("//button[text()='Calculate Premium']")
        ).click();

        WebElement result = wait.until(d ->
                d.findElement(
                        By.xpath("//h1[text()='₹5,400']")
                )
        );

        Assert.assertTrue(result.isDisplayed());

        System.out.println(
                "Bike Premium Calculation Test PASSED: ₹5,400"
        );
    }

    // Test 5: Invalid age validation

    @Test
    public void verifyInvalidAgeValidation() {

        WebElement ageInput = driver.findElement(
                By.id("age")
        );

        ageInput.clear();
        ageInput.sendKeys("17");

        Boolean isInvalid = (Boolean)
                ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript(
                        "return arguments[0].validity.rangeUnderflow;",
                        ageInput
                );

        Assert.assertTrue(
                isInvalid,
                "Age below 18 should be invalid"
        );

        System.out.println(
                "Invalid Age Validation Test PASSED"
        );
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
