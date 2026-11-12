
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class RegisterTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://localhost:5174";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get(baseUrl + "/register");
    }

    @Test
    public void verifyRegistrationPageElements() {

        Assert.assertTrue(
                driver.findElement(By.name("name")).isDisplayed(),
                "Full Name field is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.name("email")).isDisplayed(),
                "Email field is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.name("phone")).isDisplayed(),
                "Phone field is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.name("password")).isDisplayed(),
                "Password field is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.name("confirmPassword")).isDisplayed(),
                "Confirm Password field is missing"
        );

        Assert.assertTrue(
                driver.findElement(By.cssSelector("button[type='submit']")).isDisplayed(),
                "Create Account button is missing"
        );

        System.out.println("Registration Page Elements Test PASSED!");
    }

    @Test
    public void verifySuccessfulRegistration() {

        String email = "selenium" + System.currentTimeMillis()
                + "@gmail.com";

        String phone = "9" + String.valueOf(System.currentTimeMillis())
                .substring(3, 12);

        driver.findElement(By.name("name"))
                .sendKeys("Selenium Test User");

        driver.findElement(By.name("email"))
                .sendKeys(email);

        driver.findElement(By.name("phone"))
                .sendKeys(phone);

        driver.findElement(By.name("password"))
                .sendKeys("Test@12345");

        driver.findElement(By.name("confirmPassword"))
                .sendKeys("Test@12345");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        wait.until(d -> d.findElement(By.tagName("body"))
                .getText()
                .contains("Account created successfully"));

        String pageText = driver.findElement(By.tagName("body")).getText();

        Assert.assertTrue(
                pageText.contains("Account created successfully! You can now sign in."),
                "Customer registration was not successful"
        );

        System.out.println("Successful Registration Test PASSED!");
        System.out.println("Registered Test Email: " + email);
    }

    @Test
    public void verifyPasswordMismatch() {

        driver.findElement(By.name("name"))
                .sendKeys("Mismatch Test User");

        driver.findElement(By.name("email"))
                .sendKeys("mismatch" + System.currentTimeMillis() + "@gmail.com");

        driver.findElement(By.name("phone"))
                .sendKeys("9876543210");

        driver.findElement(By.name("password"))
                .sendKeys("Test@12345");

        driver.findElement(By.name("confirmPassword"))
                .sendKeys("Wrong@12345");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        wait.until(d -> d.findElement(By.tagName("body"))
                .getText()
                .contains("Passwords do not match."));

        Assert.assertTrue(
                driver.findElement(By.tagName("body"))
                        .getText()
                        .contains("Passwords do not match."),
                "Password mismatch validation did not work"
        );

        System.out.println("Password Mismatch Test PASSED!");
    }

    @Test
    public void verifyDuplicateEmailRegistration() {

        driver.findElement(By.name("name"))
                .sendKeys("Duplicate Test User");

        driver.findElement(By.name("email"))
                .sendKeys("insureprotest20261112014952@gmail.com");

        driver.findElement(By.name("phone"))
                .sendKeys("9876543210");

        driver.findElement(By.name("password"))
                .sendKeys("Test@12345");

        driver.findElement(By.name("confirmPassword"))
                .sendKeys("Test@12345");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        wait.until(d -> {
            String text = d.findElement(By.tagName("body")).getText();

            return text.contains("Registration failed")
                    || text.contains("already")
                    || text.contains("exists")
                    || text.contains("Duplicate");
        });

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/register"),
                "Duplicate registration should not navigate away"
        );

        System.out.println("Duplicate Email Registration Test PASSED!");
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
