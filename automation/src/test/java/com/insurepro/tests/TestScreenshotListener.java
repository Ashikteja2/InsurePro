
package com.insurepro.tests;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.IInvokedMethod;
import org.testng.IInvokedMethodListener;
import org.testng.ITestResult;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TestScreenshotListener implements IInvokedMethodListener {

    @Override
    public void afterInvocation(
            IInvokedMethod method,
            ITestResult result) {

        // Take screenshot only when a test fails
        if (method.isTestMethod()
                && result.getStatus() == ITestResult.FAILURE) {

            Object testObject = result.getInstance();

            try {
                // Get WebDriver from the test class
                java.lang.reflect.Field driverField =
                        testObject.getClass().getDeclaredField("driver");

                driverField.setAccessible(true);

                WebDriver driver =
                        (WebDriver) driverField.get(testObject);

                if (driver == null) {
                    System.out.println("Screenshot not captured: Driver is null.");
                    return;
                }

                // Create screenshots folder
                Path screenshotFolder = Paths.get("screenshots");
                Files.createDirectories(screenshotFolder);

                // Create screenshot file name
                String testName = result.getMethod().getMethodName();

                String timestamp =
                        new SimpleDateFormat("yyyyMMdd_HHmmss")
                                .format(new Date());

                String fileName = testName + "_" + timestamp + ".png";

                Path destination =
                        screenshotFolder.resolve(fileName);

                // Capture screenshot
                File screenshot =
                        ((TakesScreenshot) driver)
                                .getScreenshotAs(OutputType.FILE);

                // Save screenshot
                Files.copy(
                        screenshot.toPath(),
                        destination,
                        StandardCopyOption.REPLACE_EXISTING
                );

                System.out.println(
                        "Screenshot saved: " + destination.toAbsolutePath()
                );

            } catch (NoSuchFieldException e) {
                System.out.println(
                        "Screenshot failed: driver field not found in test class."
                );

            } catch (IllegalAccessException | IOException e) {
                System.out.println(
                        "Screenshot capture error: " + e.getMessage()
                );
            }
        }
    }
}
