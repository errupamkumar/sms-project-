package com.sms.student.controller;

import com.sms.student.entity.House;
import com.sms.student.repository.HouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/houses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HouseController {
    private final HouseRepository houseRepository;

    @GetMapping
    public List<House> getAllHouses() {
        List<House> houses = houseRepository.findAll();
        System.out.println("Fetching all houses. Found: " + houses.size());
        return houses;
    }
}
