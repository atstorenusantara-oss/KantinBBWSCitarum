/*
 * G-COFFEE POS v2.3 - ESP32 BMS Firmware (UJI COBA / TESTING MODE)
 * Deskripsi: Mengirim data sensor secara RANDOM untuk simulasi dan monitoring
 * lampu via serial.
 */

#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>

// --- KONFIGURASI WIFI & SERVER ---
const char *ssid = "TUBIS43LT2";
const char *password = "12345678";
const char *serverUrl = "http://192.168.0.149:3000";

// --- KONFIGURASI PIN ---
#define PIN_RELAY_INDOOR  16//25
#define PIN_RELAY_OUTDOOR 4

unsigned long lastUpdate = 0;
const long interval = 5000;

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(PIN_RELAY_INDOOR, OUTPUT);
  pinMode(PIN_RELAY_OUTDOOR, OUTPUT);

  digitalWrite(PIN_RELAY_INDOOR, HIGH);
  digitalWrite(PIN_RELAY_OUTDOOR, HIGH);

  WiFi.begin(ssid, password);
  Serial.print("Menghubungkan ke WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Terhubung!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("--- MEMULAI MODE UJI COBA BMS ---\n");
}

void loop() {
  if (millis() - lastUpdate >= interval) {
    lastUpdate = millis();

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println(">>> Sinkronisasi Data ke Server...");

      // 1. KIRIM DATA SENSOR RANDOM (TELEMETRY)
      float temp = 24.0 + (random(0, 50) / 10.0);
      int power = 1000 + random(0, 500);
      int water = 70 + random(0, 25);

      sendTelemetry("Suhu Area Bar", temp);
      sendTelemetry("KWH Meter Utama", (float)power);
      sendTelemetry("Level Toren Air", (float)water);

      // 2. CEK STATUS LAMPU (GET STATUS)
      checkAndControlLampu("Lampu Area Indoor", PIN_RELAY_INDOOR);
      checkAndControlLampu("Lampu Area Outdoor", PIN_RELAY_OUTDOOR);

      Serial.println("-----------------------------------\n");
    } else {
      Serial.println("❌ WiFi Putus! Mencoba menyambung kembali...");
      WiFi.begin(ssid, password);
    }
  }
}

void sendTelemetry(String deviceName, float value) {
  HTTPClient http;
  String url = String(serverUrl) + "/api/bms/telemetry";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["device_name"] = deviceName;
  doc["value"] = value;

  String requestBody;
  serializeJson(doc, requestBody);

  int httpResponseCode = http.POST(requestBody);

  Serial.print("[Sensor] " + deviceName + ": " + String(value));
  if (httpResponseCode > 0) {
    Serial.println(" (Berhasil Terkirim)");
  } else {
    Serial.println(" (Gagal: " + String(httpResponseCode) + ")");
  }
  http.end();
}

void checkAndControlLampu(String deviceName, int pin) {
  HTTPClient http;
  String encodedName = deviceName;
  encodedName.replace(" ", "%20");

  String url = String(serverUrl) + "/api/bms/status?name=" + encodedName;

  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String response = http.getString();
    StaticJsonDocument<200> doc;
    deserializeJson(doc, response);

    String status = doc["status"];

    // PRINT STATUS HASIL GET KE SERIAL (Permintaan User)
    Serial.print("[Lampu] " + deviceName + " -> Hasil Server: " + status);

    if (status == "ON") {
      digitalWrite(pin, LOW);
      Serial.println(" (Relay AKTIF)");
    } else {
      digitalWrite(pin, HIGH);
      Serial.println(" (Relay MATI)");
    }
  } else {
    Serial.print("[Lampu] Gagal mengambil status " + deviceName +
                 " (Error: " + String(httpResponseCode) + ")");
    if (httpResponseCode == 404)
      Serial.println(" - Perangkat tidak ditemukan di DB!");
    else
      Serial.println("");
  }
  http.end();
}
