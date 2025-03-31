package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nlp")
public class NLPServiceController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/interpret")
    public List<Action> interpret(@RequestBody String userMessage) throws Exception {
        return openAIService.extractActions(userMessage);
    }
}
