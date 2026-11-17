
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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

    String baseUrl = "http://localhost:5175";
    String testEmail = "insureprotest20261112014952@gmail.com";
    String testPassword = "Test@12345";

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get(baseUrl + "/login");

        // Clear old browser storage
        driver.manage().deleteAllCookies();

        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
            "localStorage.clear(); sessionStorage.clear();"
        );

        // Create a test user before every test
        js.executeScript(
            "localStorage.setItem('insurepro_demo_users', JSON.stringify([" +
            "{" +
            "id: 999001," +
            "name: 'Selenium Test Customer'," +
            "email: '" + testEmail + "'," +
            "phone: '9876543210'," +
            "password: '" + testPassword + "'" +
            "}" +
            "]));"
        );

        // Reload login page after creating test user
        driver.navigate().refresh();
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
                .sendKeys(testEmail);

        driver.findElement(By.cssSelector("input[type='password']"))
                .sendKeys(testPassword);

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        // Wait until login navigates to dashboard
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
                .sendKeys(testEmail);

        driver.findElement(By.cssSelector("input[type='password']"))
                .sendKeys("WrongPassword123");

        driver.findElement(By.cssSelector("button[type='submit']"))
                .click();

        // Wait for the invalid login message
        wait.until(d ->
            d.findElement(By.tagName("body"))
             .getText()
             .contains("Invalid email or password")
        );

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
