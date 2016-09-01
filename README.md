# lesser

Koncept struktury plików dla projektów opartych o preprocesor LESS

### Wstęp

Repozytorium to stanowi propozycję organizacji pracy z plikami less. Inspiracjami do przedstawionych poniżej rozwiązań była praca i problemy podczas korzystania z m.in. frameworka Twitter Bootstrap, oraz poszukiwanie rozwiązań automatyzujących pracę z kaskadowymi arkuszami stylów.

### Cechy struktury

Na cechy proponowanej struktury plików less składają się:

- wprowadzenie rozszerzeń plików definiujących przeznaczenie pliku w strukturze ze względu na rolę pełnioną w projekcie;
- wprowadzenie szablonowości umożliwiającej dziedziczenie i rozszerzanie elementów w zależności od konfiguracji;
- ograniczenie do minimum wzajemnych zależności elementów projektu poprzez stosowanie zmiennych czy mikstur lokalnych;
-  podział plików na grupy w zależności od zadań wykonywanych w strukturze;
- zastosowanie szablonu zapisu pliku co umożliwia integracje z systemem bazodanowym (w celu ewentualnej integracji ze snippetami/widokami systemu szablonów).


### Struktura

**definitions** – (definicje) katalog składowania grup plików z rozszerzeniem .less

	collections – (kolekcje) formatowanie grup elementów
	module – (moduły) grupy elementów lub elementy wymagające wykorzystania javascript
	views – (widoki) formatowanie widoku (wybranego fragmentu, szablonu html)
	fonts – (czcionki) obsługa fontów
	globals – (globalnych) obsługa zmiennych, mikstur, danych resetujących

**themes** – (skórki) katalog zawierający folder skórek

	default – domyślna styl struktury
	jakisszablon – dodatkowa skórka

**style.less** – plik uruchamiany podczas kompilacji

**theme.config** – plik zawierający globalne zmienne definiujące wybór skórki

**theme.less** – plik odpowiedzialny za obsługę plików zmiennych, mikstur, nadpisań

### Opis struktury

Posłużmy się przykładem opisującym strukturę. W definicjach posiadamy kolekcję o nazwie grid czyli siatkę formatującą stronę. Plik ten będzie posiadał następujący zapis:

	@type    : 'collection';
	@element : 'grid';
	@import (multiple) '../../theme.config';
	// kod tworzący siatkę

Wszystkie pliki w definicjach posiadają zapis określający typ pliku, nazwę elementu, importujący plik wybierający skórki, a następnie zawierający kod less/css.

W domyślnym szablonie themes/default znajduje się odzwierciedlenie struktury katalogów definicji . Pliki w nich zawarte dzielą się na trzy grupy i dla siatki grid będą to:

- `collections/grid.variables` – zawiera zmienne ze zdefiniowanymi wartościami
- `collections/grid.mixins` – zawiera mikstury
- `collections/grid.overrides` – zawiera kod less/css

Pliki w szablonach nie posiadają zapisu jak pliki w definicjach, ale mają jasno zdefiniowaną rolę. Analogicznie do skórki domyślnej będzie wyglądał zapis w innych skórkach.

Istotną sprawą jest fakt, iż pliki w skórkach nie są wymagane i służą do nadpisywania plików definicji (chodź w przypadku występowania zmiennych lub mikstur warto przyjąć, że skórka domyślna zawiera takie pliki).

### Flow działania

- podczas kompilacji załączany jest główny plik less style.css
- zawiera on m.in. zapis:

		@import "definitions/collections/grid.less";

- wczytany plik grid wczytuje theme.config posiadający zapis:

		/* Kolekcje */
		@grid: 'default';
		/* Ścieżka do skórek */
		@themesFolder: 'themes';
		/* Zaimportowanie ścieżek */
		@import "theme.less";

- plik powyższy definiuje którą skórkę ma wykorzystać grid oraz ustawia ścieżkę do skórek
- wczytujemy plik theme.less zawierający następujący zapis:

		/* Zdefiniowanie wyboru skórki dla zdefiniowanego pliku less */
		@theme: @@element;
		/* Mikstury domyślne (opcjonlanie)  */
		@import (optional) "@{themesFolder}/default/@{type}s/@{element}.mixins";
		/* Mikstury domyślne (opcjonlanie) dla wybranej skórki */
		@import (optional) "@{themesFolder}/@{theme}/@{type}s/@{element}.mixins";
		/* Zmienne dla zdefiniowanego modułu/pliku less */
		@import (optional) "@{themesFolder}/default/@{type}s/@{element}.variables";
		/* Nadpisanie zmiennych dla zdefiniowanego modułu/pliku less */
		@import (optional) "@{themesFolder}/@{theme}/@{type}s/@{element}.variables";
		/* Dopisanie lub nadpisanie klas zdefiniowanego modułu przez plik w skórce */
		@import (optional) "@{themesFolder}/@{theme}/@{type}s/@{element}.overrides";

- plik ten obrazuje w jaki sposób następuje zbieranie informacji na temat mikstur, zmiennych i nadpisań. Należy zwrócić uwagę, że wczytanie następuje w kolejności: skórka domyślna, skórka dodatkowa, kod z definicji.
- w zależności od potrzeb możemy ustawić set globalnych zmiennych i mikstur, a w przeciwnym razie zbierane są one zgodnie z kolejnością określoną w style.less

### Zalety

- przejrzysta struktura plików;
- trudniej o konflikty podczas commitowania;
- bardzo szybkie tworzenie skórek;
- niezależność elementów;
- łatwiejsza integracja z systemami szablonów (element per widok);
- mniej kodu do przeglądania (szybsza praca) i kodu wynikowego.

### Wady

- ryzyko powtórzenie zdefiniowania i nadania nowej wartości zmiennych (może być to też zaleta w zależności od podejścia do nazewnictwa);

### Przykładowe elementy

Przykładowe umiejscowienie elementów

- `collections/form` – formularze z inputami
- `collections/grid` – siatka
- `globals/reset` – reset css
- `globals/colors` – zmienne kolorów
- `modules/navbar` – pasek górny z menu z js
- `modules/modal` – obsługa modali
- `views/post` – obsługa wpisów
- `views/comment` – formatowanie komentarzy


Podział na typy można rozszerzać lub sugerować się na przykład podziałem zastosowanym w Semantic UI.
Załączone pliki

Załączona paczka zawiera bardzo podstawowy przykład koncepcji.

- odpalamy npm update
- uruchamiamy poprzez polecenie `grunt`
