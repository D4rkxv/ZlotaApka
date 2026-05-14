## Instalacja i uruchomienie lokalne

Aby uruchomić aplikację Złota Apka na swoim komputerze, upewnij się, że masz zainstalowane [Node.js](https://nodejs.org/) (wersja zalecana: LTS). Aplikacja składa się z dwóch głównych części, które muszą być uruchomione jednocześnie w osobnych oknach terminala.

### 1. Uruchomienie Frontend'u

W głównym folderze projektu otwórz terminal i wpisz poniższe komendy:

1. Pobierz wymagane pakiety:
   ```bash
   npm i
   ```
2. Uruchom serwer developerski:
   ```bash
   npm run dev
   ```

### 2. Uruchomienie Backend'u

Otwórz **nowe okno/kartę terminala** i przejdź do folderu backend, a następnie uruchom serwer:

1. Przejdź do katalogu backend (jeśli ścieżka do folderu to `backend`):
   ```bash
   cd backend
   ```
2. Pobierz pakiety dla backendu:
   ```bash
   npm i
   ```
3. Uruchom aplikację backendową:
   ```bash
   node .
   ```

Po poprawnym wykonaniu obu kroków, interfejs użytkownika będzie dostępny w przeglądarce pod adresem, który wyświetli się w pierwszym terminalu (zazwyczaj http://localhost:3000 lub podobny).
