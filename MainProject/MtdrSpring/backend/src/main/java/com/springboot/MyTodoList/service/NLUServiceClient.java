package com.springboot.MyTodoList.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

/**
 * Cliente que se comunica con el microservicio Python (Flask)
 * para interpretar lenguaje natural en acciones estructuradas.
 */
public class NLUServiceClient {

    /**
     * Envía una instrucción de texto al endpoint Flask y recibe acciones JSON.
     *
     * @param userInput Instrucción del usuario en lenguaje natural.
     * @return JSONArray con acciones interpretadas.
     * @throws IOException si falla la conexión o lectura de datos.
     */
    public static JSONArray callInterpretService(String userInput) throws IOException, JSONException {
        URI uri = URI.create("http://localhost:5000/interpret");
        HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();

        // Configuración del request
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; utf-8");
        connection.setDoOutput(true);

        // Construimos el payload JSON
        JSONObject jsonInput = new JSONObject();
        jsonInput.put("input", userInput);

        try (OutputStream os = connection.getOutputStream()) {
            os.write(jsonInput.toString().getBytes("utf-8"));
        }

        // Leemos la respuesta
        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(connection.getInputStream(), "utf-8"))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
        }

        // Parseamos la respuesta a JSON
        JSONObject result = new JSONObject(response.toString());
        return result.getJSONArray("actions");
    }
}