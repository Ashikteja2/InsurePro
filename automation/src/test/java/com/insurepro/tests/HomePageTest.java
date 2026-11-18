
package com.insurepro.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class HomePageTest {

    WebDriver driver;

    String baseUrl = "http://127.0.0.1:5175";

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    public void verifyHomePageLoads() {

        driver.get(baseUrl);

        String currentUrl = driver.getCurrentUrl();
        String pageTitle = driver.getTitle();

        String pageContent = driver.findElement(
                By.tagName("body")
        ).getText();

        System.out.println("Website URL: " + currentUrl);
        System.out.println("Page Title: " + pageTitle);

        // Verify the correct website URL
        Assert.assertTrue(
                currentUrl.contains("127.0.0.1:5175"),
                "InsurePro Home page URL is incorrect"
        );

        // Verify that home page content is displayed
        Assert.assertFalse(
                pageContent.trim().isEmpty(),
                "Home page content is empty"
        );

        System.out.println("InsurePro Home Page Test PASSED!");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
