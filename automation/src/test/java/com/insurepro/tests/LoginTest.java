
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

public class LoginTest {

    WebDriver driver;
    WebDriverWait wait;
String baseUrl = "http://localhost:5174";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get(baseUrl + "/login");

        // Clear previous login information
        driver.manage().deleteAllCookies();
        driver.get(baseUrl + "/login");
    }

    @Test
    public void verifyLoginPageElements() {

        Assert.assertTrue(
                driver.findElement(By.cssSelector("input[type='email']")).isDisplayed(),
                "Email field is not displayed"
        );

        Assert.assertTrue(
                driver.findElement(By.cssSelector("input[type='password']")).isDisplayed(),
                "Password field is not displayed"
        );

        Assert.assertTrue(
                driver.findElement(By.cssSelector("button[type='submit']")).isDisplayed(),
                "Login button is not displayed"
        );

        System.out.println("Login Page Elements Test PASSED!");
    }

    @Test
    public void verifyValidLogin() {

        driver.findElement(By.cssSelector("input[type='email']"))
                .sendKeys("insureprotest20261112014952@gmail.com");

        driver.findElement(By.cssSelector("input[type='password']"))
                .sendKeys("Test@12345");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        wait.until(d -> d.getCurrentUrl().contains("/dashboard"));

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/dashboard"),
                "Valid login failed"
        );

        System.out.println("Valid Login Test PASSED!");
    }

    @Test
    public void verifyInvalidLogin() {

        driver.findElement(By.cssSelector("input[type='email']"))
                .sendKeys("insureprotest20261112014952@gmail.com");

        driver.findElement(By.cssSelector("input[type='password']"))
                .sendKeys("WrongPassword123");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        wait.until(d -> {
            String body = d.findElement(By.tagName("body")).getText();
            return body.contains("Invalid")
                    || body.contains("password")
                    || body.contains("email");
        });

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/login"),
                "Invalid login should remain on login page"
        );

        System.out.println("Invalid Login Test PASSED!");
    }

    @AfterMethod
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
