package com.foodwaste.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@Slf4j
public class GeocodeService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final java.util.Map<String, double[]> cache = new java.util.concurrent.ConcurrentHashMap<>();

    private static final java.util.Map<String, double[]> CITY_CENTROIDS = java.util.Map.ofEntries(
        java.util.Map.entry("bangalore", new double[]{12.9716, 77.5946}),
        java.util.Map.entry("bengaluru", new double[]{12.9716, 77.5946}),
        java.util.Map.entry("mumbai", new double[]{19.0760, 72.8777}),
        java.util.Map.entry("delhi", new double[]{28.7041, 77.1025}),
        java.util.Map.entry("new delhi", new double[]{28.6139, 77.2090}),
        java.util.Map.entry("chennai", new double[]{13.0827, 80.2707}),
        java.util.Map.entry("kolkata", new double[]{22.5726, 88.3639}),
        java.util.Map.entry("hyderabad", new double[]{17.3850, 78.4867}),
        java.util.Map.entry("pune", new double[]{18.5204, 73.8567}),
        java.util.Map.entry("ahmedabad", new double[]{23.0225, 72.5714}),
        java.util.Map.entry("jaipur", new double[]{26.9124, 75.7873}),
        java.util.Map.entry("lucknow", new double[]{26.8467, 80.9462}),
        java.util.Map.entry("patna", new double[]{25.5941, 85.1376}),
        java.util.Map.entry("bhopal", new double[]{23.2599, 77.4126}),
        java.util.Map.entry("indore", new double[]{22.7196, 75.8577}),
        java.util.Map.entry("chandigarh", new double[]{30.7333, 76.7794})
    );

    public GeocodeService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public double[] geocodeAddress(String address) {
        if (address == null || address.isBlank()) {
            return null;
        }

        String normalizedAddress = address.trim().toLowerCase();
        if (cache.containsKey(normalizedAddress)) {
            log.info("Geocode cache hit for address: {}", address);
            return cache.get(normalizedAddress);
        }

        // Try geocoding full address
        double[] coords = queryNominatim(address);
        if (coords != null) {
            cache.put(normalizedAddress, coords);
            return coords;
        }

        // Fallback 1: Try geocoding just the city (if address has a comma)
        if (address.contains(",")) {
            String cityPart = address.substring(address.lastIndexOf(",") + 1).trim();
            log.info("Geocoding failed for full address. Trying fallback 1 (city part): {}", cityPart);
            coords = queryNominatim(cityPart);
            if (coords != null) {
                cache.put(normalizedAddress, coords);
                return coords;
            }
        }

        // Fallback 2: Check static centroids dictionary
        log.info("Geocoding failed for Nominatim queries. Trying fallback 2 (static centroid lookup).");
        for (String city : CITY_CENTROIDS.keySet()) {
            if (normalizedAddress.contains(city)) {
                coords = CITY_CENTROIDS.get(city);
                log.info("Found centroid fallback for city: {}", city);
                cache.put(normalizedAddress, coords);
                return coords;
            }
        }

        return null;
    }

    private double[] queryNominatim(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = "https://nominatim.openstreetmap.org/search?q=" + encodedQuery + "&format=json&limit=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "FoodShareApp/1.0")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.isArray() && root.size() > 0) {
                    JsonNode firstResult = root.get(0);
                    double lat = Double.parseDouble(firstResult.path("lat").asText());
                    double lng = Double.parseDouble(firstResult.path("lon").asText());
                    return new double[]{lat, lng};
                }
            } else {
                log.warn("Geocoding query failed with status code: {}", response.statusCode());
            }
        } catch (Exception e) {
            log.warn("Failed to query Nominatim for: {}", query, e);
        }
        return null;
    }
}
