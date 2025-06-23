package com.h3rhex.GymTracker.Controllers;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class PageControllers {
    @RequestMapping("/")
    String index() {
        return "forward:/index.html";
    }

    @RequestMapping("/login")
    String loginPage() {
        return "forward:/pages/login.html";
    }

    @RequestMapping("/register")
    String registerPage() { return "forward:/pages/register.html"; }

    // NEED TO BE LOGGED
    @RequestMapping("/home")
    String home() { return "forward:/pages/loggedHome.html"; }

    @RequestMapping("/profile")
    String profile() { return "forward:/pages/profile.html"; }

    @RequestMapping("/rutinas")
    String rutinas() { return "forward:/pages/routines.html"; }

    @RequestMapping("/progreso")
    @ResponseBody
    String progreso() { return "En desarrollo"; }

}
