package com.springboot.MyTodoList.util;

import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InlineKeyboardHelper {

    /**
     * Construye un mensaje de Telegram con InlineKeyboard.
     * keyValuePairs: { "callback_data_1" : "Texto Botón 1", "callback_data_2" : "Texto Botón 2", ... }
     */
    public static SendMessage createInlineKeyboardMessage(Long chatId, String promptText, Map<String, String> keyValuePairs) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(promptText);

        // Crear la lista de filas del teclado
        List<List<InlineKeyboardButton>> rowsInline = new ArrayList<>();

        // Para cada entrada en el map, se crea un botón
        // Nota: la lógica de distribuirlos en filas depende de ti (una fila por botón, o varios por fila)
        for (Map.Entry<String, String> entry : keyValuePairs.entrySet()) {
            String callbackData = entry.getKey();
            String buttonText = entry.getValue();

            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(buttonText);
            button.setCallbackData(callbackData);

            // Se crea una fila para cada botón (o agrupar varios en la misma)
            List<InlineKeyboardButton> row = new ArrayList<>();
            row.add(button);

            rowsInline.add(row);
        }

        // Asignar las filas al objeto InlineKeyboardMarkup
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        inlineKeyboardMarkup.setKeyboard(rowsInline);

        // Asignar el markup al mensaje
        message.setReplyMarkup(inlineKeyboardMarkup);

        return message;
    }
}