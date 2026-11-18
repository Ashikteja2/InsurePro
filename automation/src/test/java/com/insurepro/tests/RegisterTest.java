
package com.insurepro.tests;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class RegisterTest {

    WebDriver driver;
    WebDriverWait wait;

    String baseUrl = "http://127.0.0.1:5175";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get(baseUrl + "/register");
    }

    // TEST 1: Verify registration page elements
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

    // TEST 2: Verify successful registration
    @Test
    public void verifySuccessfulRegistration() {

        String email = "selenium"
                + System.currentTimeMillis()
                + "@gmail.com";

        String phone = String.valueOf(
                1000000000L + (System.currentTimeMillis() % 9000000000L)
        );

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
                .contains("Account created successfully! Please sign in."));

        String pageText = driver.findElement(By.tagName("body")).getText();

        Assert.assertTrue(
                pageText.contains("Account created successfully! Please sign in."),
                "Customer registration was not successful"
        );

        System.out.println("Successful Registration Test PASSED!");
        System.out.println("Registered Test Email: " + email);
    }

    // TEST 3: Verify password mismatch validation
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

        String pageText = driver.findElement(By.tagName("body")).getText();

        Assert.assertTrue(
                pageText.contains("Passwords do not match."),
                "Password mismatch validation did not work"
        );

        System.out.println("Password Mismatch Test PASSED!");
    }

    // TEST 4: Verify duplicate email registration
    @Test
    public void verifyDuplicateEmailRegistration() {

        String existingEmail = "duplicate"
                + System.currentTimeMillis()
                + "@gmail.com";

        // Add an existing user to localStorage
        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
                "localStorage.setItem('insurepro_demo_users', JSON.stringify([" +
                "{" +
                "id: 999," +
                "name: 'Existing Test User'," +
                "email: arguments[0]," +
                "phone: '9876543210'," +
                "password: 'Test@12345'" +
                "}" +
                "]));",
                existingEmail
        );

        // Fill registration form using the same email
        driver.findElement(By.name("name"))
                .sendKeys("Duplicate Test User");

        driver.findElement(By.name("email"))
                .sendKeys(existingEmail);

        driver.findElement(By.name("phone"))
                .sendKeys("9876543211");

        driver.findElement(By.name("password"))
                .sendKeys("Test@12345");

        driver.findElement(By.name("confirmPassword"))
                .sendKeys("Test@12345");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        // Wait for duplicate email message
        wait.until(d -> d.findElement(By.tagName("body"))
                .getText()
                .contains("This email is already registered. Please sign in."));

        String pageText = driver.findElement(By.tagName("body")).getText();

        Assert.assertTrue(
                pageText.contains("This email is already registered. Please sign in."),
                "Duplicate email validation did not work"
        );

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/register"),
                "Duplicate registration should remain on registration page"
        );

        System.out.println("Duplicate Email Registration Test PASSED!");
    }

    // Close browser after every test
    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
