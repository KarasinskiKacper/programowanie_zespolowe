# Harmonogram

Harmonogram to aplikacja internetowa umożliwiająca zarządzanie własnoręcznie przygotowanym harmonogramem. Aplikacja pozwala na dodawanie nowych zadań, edycję istniejących oraz wyświetlanie harmonogramu w postaci kalendarza, tablicy tygodnia i listy.

## Struktura projektu

Projekt składa się z następujących części:

* `backend`: zawiera kod serwera aplikacji, napisany w Pythonie z użyciem frameworka Flask.
* `frontend`: zawiera kod klienta aplikacji, napisany w JavaScript.
* `db`: zawiera plik bazy danych.

## Wymagania

Aby uruchomić aplikację, potrzebne są następujące narzędzia:

* Python 3.12+ 
<br/> lub
* Docker

## Uruchomienie aplikacji
### Poprzez Python

1. Sklonuj repozytorium aplikacji `git clone https://github.com/KarasinskiKacper/programowanie_zespolowe.git`
2. Wejdź do folderu repozytorium `cd programowanie_zespolowe`
3. Pobierz wymagane biblioteki `pip install -r requirements.txt`
4. Uruchom serwer aplikacji, wykonując polecenie `python ./backend/app.py`
5. Wejdź na stronę `http://127.0.0.1:5000`

### Poprzez Docker wykorzystując repozytorium na GitHub

1. Sklonuj repozytorium aplikacji `git clone https://github.com/KarasinskiKacper/programowanie_zespolowe.git`
2. Wejdź do folderu repozytorium `cd programowanie_zespolowe`
3. Utwórz obraz kontenera `docker build --tag harmonogram .`
4. Uruchom kontener `docker run -p 5000:5000 harmonogram`
5. Wejdź na stronę `http://127.0.0.1:5000`

### Poprzez Docker wykorzystując repozytorium na DockerHub

1. Uruchom kontener `docker run -p 5000:5000 kacper804/programowanie_zespolowe:latest`
2. Wejdź na stronę `http://127.0.0.1:5000`

## Użycie

Aplikacja umożliwia dodawanie nowych zadań, edycję istniejących oraz wyświetlanie harmonogramu w postaci kalendarza. Utwórz konto wchodząc na stronę rejestracji i zaloguj się. Aby dodać nowe zadanie, należy kliknąć przycisk "Dodaj nowe zadanie" na widoku harmonogramu lub klikając w datę na kalendarzu, a następnie wypełnić formularz. Aby edytować istniejące zadanie, należy kliknąć na nie w harmonogramie. 

## Autorzy

Aplikacja została stworzona przez:
* Całus Mikołaj
* Dyczek Paweł
* Herzyk Paweł
* Karasiński Kacper
