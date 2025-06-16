package com.h3rhex.GymTracker.Controllers;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageControllers {
    @RequestMapping("/")
    String home() {
        return "forward:/index.html";
    }

    @RequestMapping("/login")
    String loginPage() {
        return "forward:/pages/login.html";
    }

    @RequestMapping("/register")
    String registerPage() { return "forward:/pages/register.html"; }
}
