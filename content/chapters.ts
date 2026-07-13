export interface Chapter {
  slug: string;
  title: string;
  order: number;
  summary: string;
  lessonMarkdown: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput?: string;
}

export interface ChapterSection {
  id: string;
  title: string;
  sourceOffset: number;
}

export const CODING_GUIDE_SECTION_ID = "persiapan-coding-challenge";

export const chapters: Chapter[] = [
  {
    slug: "tentang-go",
    title: "Tentang Go",
    order: 1,
    summary: "sejarah, cara kerja, dan bagaimana Go jalan di mesin",
    lessonMarkdown: `
Go (kadang disebut Golang) adalah bahasa pemrograman open source dari Google: **statically typed**, **dikompilasi ke kode mesin native**, punya **garbage collector**, dan dukungan konkurensi bawaan. Sebelum menulis kode, kenali dulu asal-usul dan cara kerjanya. Semua fakta di bawah diambil dari dokumentasi resmi (lihat **Sumber** di akhir).

### Bagaimana Go dibuat

Go lahir dari rasa frustrasi terhadap bahasa yang dipakai di Google saat itu. Menurut FAQ resmi, seorang programmer harus memilih salah satu dari *"efficient compilation, efficient execution, or ease of programming"* — ketiganya tidak tersedia sekaligus dalam satu bahasa mainstream. Ditambah build C++ yang lambat dan naiknya CPU multicore yang menuntut konkurensi sebagai fitur kelas satu.

Tiga perancang awalnya — **Robert Griesemer**, **Rob Pike**, dan **Ken Thompson** — mulai menggambar tujuan bahasa ini di papan tulis pada **21 September 2007**.

- **21 Sep 2007** — Griesemer, Pike, Thompson menyketsa tujuan bahasa baru.
- **Januari 2008** — Ken Thompson mulai menggarap compiler pertama.
- **Akhir 2008** — Russ Cox bergabung, mendorong Go dari prototipe jadi kenyataan.
- **10 Nov 2009** — Go dirilis sebagai proyek open source publik.
- **Maret 2012** — Go 1.0 dirilis, disertai janji kompatibilitas untuk program Go 1.

### Bagaimana Go bekerja

Tujuan desainnya, dalam kata-kata FAQ Go, adalah menggabungkan *"the ease of programming of an interpreted, dynamically typed language with the efficiency and safety of a statically typed, compiled language."*

- **Statically typed & compiled** — tipe diperiksa saat kompilasi, lalu program di-compile lebih dulu (ahead-of-time) ke kode mesin, bukan diinterpretasi saat jalan.
- **Kompilasi cepat** — membangun executable besar dirancang memakan *"at most a few seconds"* di satu komputer.
- **Garbage collected** — memori dikelola otomatis (mark-and-sweep); optimasi bertahun-tahun menekan jeda GC sering ke rentang sub-milidetik walau heap besar.
- **Konkurensi bawaan** — model dari CSP (Communicating Sequential Processes-nya Tony Hoare). Goroutine sangat murah (stack cuma beberapa kilobyte) sehingga ratusan ribu goroutine muat dalam satu address space, dan channel dipakai untuk komunikasi antar goroutine.

### Bagaimana Go berjalan di atas mesin

Poin penting yang sering disalahpahami: **Go tidak memakai virtual machine.** FAQ menyatakan tegas *"Go's runtime does not include a virtual machine, such as is provided by the Java runtime."* Program Go dikompilasi langsung ke kode mesin native.

- **Binary native & statically linked** — linker toolchain \`gc\` menghasilkan binary statically linked secara default; tiap binary sudah menyertakan Go runtime, jadi jalan tanpa dependensi eksternal.
- **Go runtime (bukan VM)** — pustaka runtime yang, kata dokumentasi, *"analogous to libc"*: mengurus garbage collection, konkurensi, dan manajemen stack — tapi tetap kode native.
- **Scheduler goroutine (M:N)** — runtime me-multiplex banyak goroutine ke sekumpulan OS thread. Saat sebuah goroutine memblokir (mis. system call), runtime memindahkan goroutine lain ke thread yang bisa jalan. Implementasinya dikenal sebagai model G–M–P (Goroutine, Machine/OS-thread, Processor).
- **Stack yang bisa berubah ukuran** — goroutine baru diberi stack beberapa kilobyte; saat kurang, runtime menumbuhkan/menyusutkannya otomatis.
- **Garbage collector konkuren** — di mesin multiprosesor, kolektor jalan di core CPU terpisah, paralel dengan program utama.
- **Cross-compile** — karena hasilnya binary native mandiri, kamu bisa mengompilasi untuk target lain (mis. Linux/ARM) dari satu mesin lewat \`GOOS\` dan \`GOARCH\`.

### Sumber

- [Frequently Asked Questions (FAQ) — go.dev](https://go.dev/doc/faq)
- [Go 1 Release Notes (rilis Maret 2012)](https://go.dev/doc/go1)
- [Release History — go.dev](https://go.dev/doc/devel/release)
- [Kode sumber scheduler runtime Go (runtime/proc.go)](https://cs.opensource.google/go/go/+/master:src/runtime/proc.go)

Tugas: jalankan kode di samping — program ini pakai paket \`runtime\` untuk menunjukkan Go benar-benar berjalan native di atas mesin ini (versi, OS, arsitektur, jumlah CPU). Nilainya bisa berbeda tergantung mesin yang menjalankan.
`,
    starterCode: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	// Program ini benar-benar dikompilasi ke kode mesin native, lalu dijalankan
	// langsung di atas OS — bukan lewat virtual machine.
	fmt.Println("Versi Go   :", runtime.Version())
	fmt.Println("Sistem (OS):", runtime.GOOS)
	fmt.Println("Arsitektur :", runtime.GOARCH)
	fmt.Println("Jumlah CPU :", runtime.NumCPU())
	fmt.Println("Goroutine  :", runtime.NumGoroutine())
}
`,
    solutionCode: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	// Program ini benar-benar dikompilasi ke kode mesin native, lalu dijalankan
	// langsung di atas OS — bukan lewat virtual machine.
	fmt.Println("Versi Go   :", runtime.Version())
	fmt.Println("Sistem (OS):", runtime.GOOS)
	fmt.Println("Arsitektur :", runtime.GOARCH)
	fmt.Println("Jumlah CPU :", runtime.NumCPU())
	fmt.Println("Goroutine  :", runtime.NumGoroutine())
}
`,
  },
  {
    slug: "hello-go",
    title: "Hello, Go",
    order: 2,
    summary: "package main, fungsi main, output, variabel, dan input sederhana",
    lessonMarkdown: `
### 1. Struktur program Go

Setiap program Go dimulai dari **package**. Program yang bisa dijalankan langsung harus berada di \`package main\`, dan harus punya fungsi \`func main()\` — itu adalah titik masuk (entry point) program.

### 2. Mencetak teks dengan fmt.Println

Untuk mencetak sesuatu ke layar, kita pakai paket standar \`fmt\` (format) dan fungsi \`fmt.Println\`. Nama paket ditulis di bagian \`import\`, lalu fungsinya dipanggil dengan format \`fmt.Println(...)\`.

\`\`\`go
package main

import "fmt"

func main() {
	fmt.Println("Halo, Go!")
}
\`\`\`

Jalankan contoh di atas. Panel latihan di sebelah kanan menggunakan versi variabel dengan hasil output yang sama.

### 3. Mencetak nilai dari variabel

Teks tidak harus selalu ditulis langsung di dalam \`fmt.Println\`. Kita bisa menyimpan nilai dalam **variabel**, lalu mencetak variabel tersebut.

\`\`\`go
package main

import "fmt"

func main() {
\tnama := "Go"
\tfmt.Println("Halo,", nama+"!")
}
\`\`\`

Baris \`nama := "Go"\` membuat variabel bernama \`nama\` dan mengisinya dengan teks \`Go\`.

Tanda \`+\` di antara dua string berarti **menggabungkan teks** (*string concatenation*). Jadi, jika \`nama\` berisi \`"Go"\`, maka \`nama + "!"\` menghasilkan string baru \`"Go!"\`.

Pada contoh tadi, \`fmt.Println("Halo,", nama+"!")\` menerima dua nilai: \`"Halo,"\` dan \`"Go!"\`. \`fmt.Println\` otomatis memberi satu spasi di antara nilai-nilai tersebut, sehingga hasil akhirnya \`Halo, Go!\`. Tanda \`+\` dipakai supaya tanda seru menempel pada nama, bukan menjadi nilai terpisah yang ikut diberi spasi.

\`+\` juga bisa dipakai untuk penjumlahan angka, tetapi pada contoh ini kedua nilai yang digabungkan adalah string:

\`\`\`go
nama := "Go"
fmt.Println("Halo,", nama, "!")     // Halo, Go !
fmt.Println("Halo,", nama+"!")     // Halo, Go!
fmt.Println("Halo, " + nama + "!")  // Halo, Go!
\`\`\`

### 4. Membaca input dengan fmt.Scan

Agar satu program bisa menyapa banyak orang, nama tidak perlu ditulis di dalam kode. Kita bisa membacanya dari **input standar** menggunakan \`fmt.Scan\`.

\`\`\`go
package main

import "fmt"

func main() {
\tvar nama string
\tfmt.Scan(&nama)
\tfmt.Println("Halo,", nama+"!")
}
\`\`\`

Urutannya adalah:

1. \`var nama string\` membuat variabel teks bernama \`nama\`.
2. \`fmt.Scan(&nama)\` membaca satu kata dari input dan mengisikan nilainya ke \`nama\`.
3. \`&nama\` berarti alamat variabel \`nama\`; alamat ini diperlukan agar \`fmt.Scan\` bisa mengubah isi variabel tersebut.
4. \`fmt.Println\` mencetak sapaan menggunakan nilai yang sudah dibaca.

Jika inputnya \`GoLearner\`, outputnya menjadi \`Halo, GoLearner!\`. \`fmt.Scan\` membaca nilai yang dipisahkan spasi, jadi contoh ini cocok untuk nama satu kata.

Coba jalankan kode di panel, lalu ubah nilai variabel \`nama\`. Setelah itu, kerjakan quiz untuk mencoba versi yang menerima nama dari input.
`,
    starterCode: `package main

import "fmt"

func main() {
	nama := "Go"
	fmt.Println("Halo,", nama+"!")
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	nama := "Go"
	fmt.Println("Halo,", nama+"!")
}
`,
    expectedOutput: "Halo, Go!",
  },
  {
    slug: "variabel-tipe",
    title: "Variabel & Tipe Data",
    order: 3,
    summary: "var, const, tipe dasar, dan :=",
    lessonMarkdown: `
Go adalah bahasa **statically typed** — setiap variabel punya tipe yang pasti. Ada beberapa cara mendeklarasikan variabel:

\`\`\`go
var nama string = "Budi"
var umur int = 20
skor := 99.5        // := menyimpulkan tipe otomatis (short declaration)
const pi = 3.14159   // const tidak bisa diubah setelah dideklarasikan
\`\`\`

Tipe dasar yang sering dipakai: \`string\`, \`int\`, \`float64\`, \`bool\`.

Tugas: buat variabel \`nama\` (string) dan \`umur\` (int), lalu cetak keduanya dengan \`fmt.Println\`.
`,
    starterCode: `package main

import "fmt"

func main() {
	// TODO: deklarasikan variabel nama dan umur, lalu cetak
	nama := "Budi"
	umur := 20
	fmt.Println(nama, umur)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	nama := "Budi"
	umur := 20
	fmt.Println(nama, umur)
}
`,
    expectedOutput: "Budi 20",
  },
  {
    slug: "simbol-operator",
    title: "Simbol & Operator",
    order: 4,
    summary: ":=, =, ==, dan operator lain yang sering dipakai",
    lessonMarkdown: `
Sebelum lanjut, kita bereskan dulu simbol-simbol yang bakal terus muncul. Yang paling sering bikin bingung pemula: **\`:=\` vs \`=\` vs \`==\`**.

### Deklarasi vs penugasan vs perbandingan

\`\`\`go
skor := 10   // :=  bikin variabel BARU + isi nilai (tipe disimpulkan otomatis)
skor = 25    // =   ubah nilai variabel yang SUDAH ada (bukan bikin baru)
skor == 25   // ==  BANDINGKAN dua nilai, hasilnya bool (true/false)
\`\`\`

\`:=\` cuma boleh untuk variabel baru — kalau variabelnya sudah ada, pakai \`=\`. Ingat juga bentuk panjang \`var nama string = "Budi"\` dari bab sebelumnya; \`:=\` hanya versi singkatnya di dalam fungsi.

**Jebakan klasik:** di dalam \`if\`, menulis \`if x = 5\` itu salah (itu penugasan) — yang kamu mau hampir selalu \`if x == 5\` (perbandingan).

### Aritmatika

\`\`\`go
a + b   a - b   a * b   a / b
a % b   // sisa bagi (modulo), mis. 25 % 7 = 4
n++     // tambah 1        n--   // kurang 1
n += 3  // sama dengan n = n + 3   (ada juga -=, *=, /=)
\`\`\`

### Perbandingan & logika

\`\`\`go
==  !=  <  <=  >  >=        // hasil bool
&&  (dan)   ||  (atau)   !  (bukan)
lulus := skor >= 20 && sisa > 0
\`\`\`

### Simbol lanjutan (dibahas lebih dalam di bab Pointer & Konkurensi)

\`\`\`go
&x        // ambil ALAMAT memori x           (bab Pointer)
*p        // ambil NILAI di alamat p          (bab Pointer)
ch <- v   // KIRIM v ke channel               (bab Konkurensi)
v := <-ch // TERIMA dari channel
nilai, _ := bagi(20, 6)   // _  buang nilai yang tak dipakai (blank identifier)
jumlah(1, 2, 3, 4)        // ... variadic: fungsi terima argumen berapa pun
\`\`\`

Tugas: jalankan kode di samping — ia memakai \`:=\`, \`=\`, \`%\`, \`++\`, \`==\`/\`!=\`, \`&&\`, \`_\`, dan \`...\` sekaligus. Perhatikan komentarnya biar tiap simbol nyantol.
`,
    starterCode: `package main

import "fmt"

func main() {
	// := membuat variabel BARU sekaligus mengisi nilai (tipe otomatis)
	skor := 10
	// = mengubah nilai variabel yang SUDAH ada (bukan bikin baru)
	skor = 25

	sisa := skor % 7 // % = sisa bagi: 25 % 7 = 4
	skor++           // ++ menambah 1: 25 -> 26

	// == membandingkan (hasilnya bool), beda dari = yang menugaskan
	fmt.Println("skor =", skor)
	fmt.Println("sisa =", sisa)
	fmt.Println("skor == 26:", skor == 26)
	fmt.Println("skor != sisa:", skor != sisa)

	// && (dan), || (atau), ! (bukan)
	lulus := skor >= 20 && sisa > 0
	fmt.Println("lulus:", lulus)

	// _ = blank identifier: buang nilai yang tidak dipakai
	nilai, _ := bagi(20, 6)
	fmt.Println("hasil bagi:", nilai)

	// ... = variadic: fungsi menerima argumen berapa pun
	fmt.Println("total:", jumlah(1, 2, 3, 4))
}

func bagi(a, b int) (int, int) {
	return a / b, a % b // hasil bagi, sisa
}

func jumlah(angka ...int) int {
	total := 0
	for _, n := range angka {
		total += n
	}
	return total
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	// := membuat variabel BARU sekaligus mengisi nilai (tipe otomatis)
	skor := 10
	// = mengubah nilai variabel yang SUDAH ada (bukan bikin baru)
	skor = 25

	sisa := skor % 7 // % = sisa bagi: 25 % 7 = 4
	skor++           // ++ menambah 1: 25 -> 26

	// == membandingkan (hasilnya bool), beda dari = yang menugaskan
	fmt.Println("skor =", skor)
	fmt.Println("sisa =", sisa)
	fmt.Println("skor == 26:", skor == 26)
	fmt.Println("skor != sisa:", skor != sisa)

	// && (dan), || (atau), ! (bukan)
	lulus := skor >= 20 && sisa > 0
	fmt.Println("lulus:", lulus)

	// _ = blank identifier: buang nilai yang tidak dipakai
	nilai, _ := bagi(20, 6)
	fmt.Println("hasil bagi:", nilai)

	// ... = variadic: fungsi menerima argumen berapa pun
	fmt.Println("total:", jumlah(1, 2, 3, 4))
}

func bagi(a, b int) (int, int) {
	return a / b, a % b // hasil bagi, sisa
}

func jumlah(angka ...int) int {
	total := 0
	for _, n := range angka {
		total += n
	}
	return total
}
`,
    expectedOutput: "skor = 26\nsisa = 4\nskor == 26: true\nskor != sisa: true\nlulus: true\nhasil bagi: 3\ntotal: 10",
  },
  {
    slug: "kontrol-alur",
    title: "Kontrol Alur",
    order: 5,
    summary: "if, switch, dan for",
    lessonMarkdown: `
Go hanya punya satu bentuk perulangan: \`for\`. Tidak ada \`while\` terpisah — cukup gunakan \`for\` tanpa kondisi awal/akhir.

\`\`\`go
if skor >= 90 {
	fmt.Println("A")
} else if skor >= 80 {
	fmt.Println("B")
} else {
	fmt.Println("C")
}

for i := 0; i < 5; i++ {
	fmt.Println(i)
}

switch hari {
case "Senin":
	fmt.Println("Awal minggu")
default:
	fmt.Println("Hari biasa")
}
\`\`\`

Tugas: cetak angka 1 sampai 5 menggunakan \`for\`.
`,
    starterCode: `package main

import "fmt"

func main() {
	for i := 1; i <= 5; i++ {
		fmt.Println(i)
	}
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	for i := 1; i <= 5; i++ {
		fmt.Println(i)
	}
}
`,
    expectedOutput: "1\n2\n3\n4\n5",
  },
  {
    slug: "fungsi",
    title: "Fungsi",
    order: 6,
    summary: "parameter, banyak nilai balik, dan error",
    lessonMarkdown: `
Fungsi di Go bisa mengembalikan **lebih dari satu nilai** — pola ini paling sering dipakai untuk mengembalikan hasil sekaligus error.

\`\`\`go
func bagi(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("tidak boleh bagi nol")
	}
	return a / b, nil
}

hasil, err := bagi(10, 2)
if err != nil {
	fmt.Println("error:", err)
} else {
	fmt.Println("hasil:", hasil)
}
\`\`\`

Tugas: buat fungsi \`tambah(a, b int) int\` yang mengembalikan jumlah dua angka, lalu panggil dan cetak hasilnya.
`,
    starterCode: `package main

import "fmt"

func tambah(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(tambah(3, 4))
}
`,
    solutionCode: `package main

import "fmt"

func tambah(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(tambah(3, 4))
}
`,
    expectedOutput: "7",
  },
  {
    slug: "koleksi",
    title: "Koleksi Data",
    order: 7,
    summary: "array, slice, map, dan range",
    lessonMarkdown: `
**Slice** adalah array dinamis — paling sering dipakai dibanding array biasa. **Map** adalah struktur key-value.

\`\`\`go
angka := []int{1, 2, 3}
angka = append(angka, 4)

nilai := map[string]int{"budi": 90, "sari": 85}
nilai["andi"] = 70

for nama, skor := range nilai {
	fmt.Println(nama, skor)
}
\`\`\`

Tugas: buat slice berisi angka 1-3, tambahkan angka 4 dengan \`append\`, lalu cetak slice-nya.
`,
    starterCode: `package main

import "fmt"

func main() {
	angka := []int{1, 2, 3}
	angka = append(angka, 4)
	fmt.Println(angka)
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	angka := []int{1, 2, 3}
	angka = append(angka, 4)
	fmt.Println(angka)
}
`,
    expectedOutput: "[1 2 3 4]",
  },
  {
    slug: "struct-method",
    title: "Struct & Method",
    order: 8,
    summary: "struct, method, dan receiver",
    lessonMarkdown: `
**Struct** mengelompokkan data terkait. **Method** adalah fungsi yang punya *receiver* — mengikatnya ke sebuah tipe.

\`\`\`go
type Persegi struct {
	Sisi float64
}

func (p Persegi) Luas() float64 {
	return p.Sisi * p.Sisi
}

p := Persegi{Sisi: 4}
fmt.Println(p.Luas())
\`\`\`

Tugas: lengkapi method \`Luas()\` pada struct \`Persegi\` di bawah agar mengembalikan sisi kali sisi.
`,
    starterCode: `package main

import "fmt"

type Persegi struct {
	Sisi float64
}

func (p Persegi) Luas() float64 {
	return p.Sisi * p.Sisi
}

func main() {
	p := Persegi{Sisi: 4}
	fmt.Println(p.Luas())
}
`,
    solutionCode: `package main

import "fmt"

type Persegi struct {
	Sisi float64
}

func (p Persegi) Luas() float64 {
	return p.Sisi * p.Sisi
}

func main() {
	p := Persegi{Sisi: 4}
	fmt.Println(p.Luas())
}
`,
    expectedOutput: "16",
  },
  {
    slug: "pointer",
    title: "Pointer",
    order: 9,
    summary: "alamat memori & pass by reference",
    lessonMarkdown: `
Pointer menyimpan **alamat memori** dari sebuah nilai, bukan nilainya langsung. Berguna saat sebuah fungsi perlu mengubah nilai aslinya (bukan salinannya).

\`\`\`go
func tambahSatu(n *int) {
	*n = *n + 1
}

x := 5
tambahSatu(&x)
fmt.Println(x) // 6
\`\`\`

\`&x\` mengambil alamat \`x\`, dan \`*n\` mengakses nilai di alamat yang ditunjuk \`n\`.

Tugas: lengkapi fungsi \`gandakan\` agar mengalikan nilai yang ditunjuk pointer dengan 2.
`,
    starterCode: `package main

import "fmt"

func gandakan(n *int) {
	*n = *n * 2
}

func main() {
	x := 5
	gandakan(&x)
	fmt.Println(x)
}
`,
    solutionCode: `package main

import "fmt"

func gandakan(n *int) {
	*n = *n * 2
}

func main() {
	x := 5
	gandakan(&x)
	fmt.Println(x)
}
`,
    expectedOutput: "10",
  },
  {
    slug: "interface",
    title: "Interface",
    order: 10,
    summary: "kontrak perilaku & polymorphism",
    lessonMarkdown: `
Interface mendefinisikan **kontrak perilaku** — sekumpulan method yang harus dimiliki sebuah tipe. Tipe apa pun yang punya method tersebut otomatis memenuhi interface itu (tidak perlu kata kunci \`implements\`).

\`\`\`go
type Bentuk interface {
	Luas() float64
}

type Lingkaran struct {
	Jari float64
}

func (l Lingkaran) Luas() float64 {
	return 3.14 * l.Jari * l.Jari
}

var b Bentuk = Lingkaran{Jari: 2}
fmt.Println(b.Luas())
\`\`\`

Tugas: buat struct \`Lingkaran\` yang memenuhi interface \`Bentuk\`, lalu cetak luasnya.
`,
    starterCode: `package main

import "fmt"

type Bentuk interface {
	Luas() float64
}

type Lingkaran struct {
	Jari float64
}

func (l Lingkaran) Luas() float64 {
	return 3.14 * l.Jari * l.Jari
}

func main() {
	var b Bentuk = Lingkaran{Jari: 2}
	fmt.Println(b.Luas())
}
`,
    solutionCode: `package main

import "fmt"

type Bentuk interface {
	Luas() float64
}

type Lingkaran struct {
	Jari float64
}

func (l Lingkaran) Luas() float64 {
	return 3.14 * l.Jari * l.Jari
}

func main() {
	var b Bentuk = Lingkaran{Jari: 2}
	fmt.Println(b.Luas())
}
`,
    expectedOutput: "12.56",
  },
  {
    slug: "konkurensi",
    title: "Konkurensi",
    order: 11,
    summary: "goroutine, channel, dan sync.WaitGroup",
    lessonMarkdown: `
**Goroutine** adalah unit eksekusi ringan — cukup tambahkan kata kunci \`go\` di depan pemanggilan fungsi. **Channel** dipakai untuk komunikasi antar goroutine dengan aman.

\`\`\`go
var wg sync.WaitGroup
ch := make(chan int, 3)

for i := 0; i < 3; i++ {
	wg.Add(1)
	go func(n int) {
		defer wg.Done()
		ch <- n * n
	}(i)
}

wg.Wait()
close(ch)

sum := 0
for v := range ch {
	sum += v
}
fmt.Println(sum)
\`\`\`

Tugas: jalankan kode di samping — kode ini menjumlahkan kuadrat 0, 1, 2 (0+1+4=5) menggunakan 3 goroutine paralel.
`,
    starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	ch := make(chan int, 3)

	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			ch <- n * n
		}(i)
	}

	wg.Wait()
	close(ch)

	sum := 0
	for v := range ch {
		sum += v
	}
	fmt.Println(sum)
}
`,
    solutionCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	ch := make(chan int, 3)

	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			ch <- n * n
		}(i)
	}

	wg.Wait()
	close(ch)

	sum := 0
	for v := range ch {
		sum += v
	}
	fmt.Println(sum)
}
`,
    expectedOutput: "5",
  },
  {
    slug: "capstone",
    title: "Capstone: Mini Project",
    order: 12,
    summary: "gabungkan semua yang sudah dipelajari",
    lessonMarkdown: `
Saatnya menggabungkan semua yang sudah kamu pelajari: struct, slice, method, dan perulangan.

Tugas: lengkapi program di samping — sebuah program pencatat nilai siswa sederhana yang menghitung rata-rata dari beberapa siswa menggunakan struct dan slice.

\`\`\`go
type Siswa struct {
	Nama  string
	Nilai []int
}

func (s Siswa) RataRata() float64 {
	total := 0
	for _, n := range s.Nilai {
		total += n
	}
	return float64(total) / float64(len(s.Nilai))
}
\`\`\`

Jalankan kode di samping untuk melihat hasilnya. Selamat, kamu sudah menyelesaikan dasar-dasar Go! Lanjut ke modul lanjutan berikutnya: **eBPF**.
`,
    starterCode: `package main

import "fmt"

type Siswa struct {
	Nama  string
	Nilai []int
}

func (s Siswa) RataRata() float64 {
	total := 0
	for _, n := range s.Nilai {
		total += n
	}
	return float64(total) / float64(len(s.Nilai))
}

func main() {
	siswa := []Siswa{
		{Nama: "Budi", Nilai: []int{80, 90, 85}},
		{Nama: "Sari", Nilai: []int{95, 92, 98}},
	}

	for _, s := range siswa {
		fmt.Printf("%s: %.2f\\n", s.Nama, s.RataRata())
	}
}
`,
    solutionCode: `package main

import "fmt"

type Siswa struct {
	Nama  string
	Nilai []int
}

func (s Siswa) RataRata() float64 {
	total := 0
	for _, n := range s.Nilai {
		total += n
	}
	return float64(total) / float64(len(s.Nilai))
}

func main() {
	siswa := []Siswa{
		{Nama: "Budi", Nilai: []int{80, 90, 85}},
		{Nama: "Sari", Nilai: []int{95, 92, 98}},
	}

	for _, s := range siswa {
		fmt.Printf("%s: %.2f\\n", s.Nama, s.RataRata())
	}
}
`,
    expectedOutput: "Budi: 85.00\nSari: 95.00",
  },
  {
    slug: "ebpf-pengantar",
    title: "Pengantar eBPF",
    order: 13,
    summary: "program kecil yang jalan di dalam kernel saat ada event",
    lessonMarkdown: `
**eBPF** (extended Berkeley Packet Filter) memungkinkan kamu menjalankan program kecil **di dalam kernel Linux** — tanpa mengubah kode kernel atau menulis modul kernel. Program itu dipasang di sebuah **hook** dan dijalankan kernel setiap kali sebuah *event* terjadi.

Contoh hook yang umum:

- **kprobe / tracepoint** — event di fungsi kernel (mis. tiap kali ada \`syscall\`).
- **XDP** — event di kartu jaringan, jalan paling awal saat paket masuk (cocok untuk filter/DDoS).
- **uprobe** — event di fungsi program user space.

Sebelum program di-*load*, kernel menjalankan **verifier**: ia memastikan program aman (tidak ada loop tak terbatas, tidak akses memori sembarangan) sehingga tidak bisa membuat kernel crash. Setelah lolos, program di-**JIT compile** jadi kode mesin native supaya cepat.

Karena program eBPF asli butuh **kernel Linux + hak root**, ia tidak bisa dijalankan di panel ini. Jadi kita **tiru alurnya** dengan Go biasa: bayangkan \`handlePacket\` di bawah adalah "program eBPF" yang dipanggil kernel setiap ada paket masuk, dan ia menghitung paket per protokol.

\`\`\`text
paket masuk ─▶ [hook XDP] ─▶ program eBPF ─▶ update hitungan
\`\`\`

Tugas: jalankan kode di samping — ia menghitung berapa banyak paket \`tcp\`, \`udp\`, dan \`icmp\` dari aliran event.
`,
    starterCode: `package main

import "fmt"

// Bayangkan handlePacket ini "program eBPF" yang dijalankan kernel
// setiap ada paket masuk. Di dunia nyata ia berjalan DI DALAM kernel.
func handlePacket(proto string, counter map[string]int) {
	counter[proto]++
}

func main() {
	// Simulasi aliran event yang dikirim kernel ke program eBPF.
	packets := []string{"tcp", "udp", "tcp", "tcp", "udp", "icmp"}

	counter := map[string]int{}
	for _, p := range packets {
		handlePacket(p, counter)
	}

	// Cetak terurut biar hasilnya konsisten.
	fmt.Println("icmp:", counter["icmp"])
	fmt.Println("tcp:", counter["tcp"])
	fmt.Println("udp:", counter["udp"])
}
`,
    solutionCode: `package main

import "fmt"

// Bayangkan handlePacket ini "program eBPF" yang dijalankan kernel
// setiap ada paket masuk. Di dunia nyata ia berjalan DI DALAM kernel.
func handlePacket(proto string, counter map[string]int) {
	counter[proto]++
}

func main() {
	// Simulasi aliran event yang dikirim kernel ke program eBPF.
	packets := []string{"tcp", "udp", "tcp", "tcp", "udp", "icmp"}

	counter := map[string]int{}
	for _, p := range packets {
		handlePacket(p, counter)
	}

	// Cetak terurut biar hasilnya konsisten.
	fmt.Println("icmp:", counter["icmp"])
	fmt.Println("tcp:", counter["tcp"])
	fmt.Println("udp:", counter["udp"])
}
`,
    expectedOutput: "icmp: 1\ntcp: 3\nudp: 2",
  },
  {
    slug: "ebpf-maps",
    title: "BPF Maps",
    order: 14,
    summary: "berbagi data antara program kernel dan user space",
    lessonMarkdown: `
Program eBPF di kernel dan program biasa di **user space** perlu bertukar data. Jembatannya adalah **BPF map** — struktur data key-value yang hidup di kernel tapi bisa dibaca/ditulis dari kedua sisi.

Beberapa tipe map yang sering dipakai:

- **hash** — key-value bebas, mirip \`map\` di Go (mis. key = PID).
- **array** — key berupa index integer, ukuran tetap.
- **per-cpu** — tiap CPU punya salinan sendiri, dijumlahkan saat dibaca (menghindari *lock* saat menulis).

Pola paling umum: program di kernel **menaikkan counter** di map setiap ada event, lalu user space **membaca** map itu untuk menampilkan statistik. Di sini kita tiru dengan \`map[int]int\` biasa: hitung berapa \`syscall\` yang dilakukan tiap proses (PID).

\`\`\`text
event syscall ─▶ [program eBPF] ─▶ bpfMap[PID]++ ─▶ dibaca user space
\`\`\`

Tugas: jalankan kode di samping — ia mengagregasi jumlah syscall per PID ke dalam "BPF map", lalu mencetaknya terurut.
`,
    starterCode: `package main

import (
	"fmt"
	"sort"
)

// Event yang "ditangkap" program eBPF di kernel.
type Event struct {
	PID  int
	Call string
}

func main() {
	events := []Event{
		{1001, "read"}, {1001, "write"}, {1002, "open"},
		{1001, "read"}, {1002, "open"}, {1002, "close"},
	}

	// BPF map disimulasikan sebagai map Go: key = PID, value = jumlah syscall.
	bpfMap := map[int]int{}
	for _, e := range events {
		bpfMap[e.PID]++ // program di kernel menaikkan counter
	}

	// User space membaca map (urutkan key biar output stabil).
	pids := make([]int, 0, len(bpfMap))
	for pid := range bpfMap {
		pids = append(pids, pid)
	}
	sort.Ints(pids)
	for _, pid := range pids {
		fmt.Printf("PID %d: %d syscall\\n", pid, bpfMap[pid])
	}
}
`,
    solutionCode: `package main

import (
	"fmt"
	"sort"
)

// Event yang "ditangkap" program eBPF di kernel.
type Event struct {
	PID  int
	Call string
}

func main() {
	events := []Event{
		{1001, "read"}, {1001, "write"}, {1002, "open"},
		{1001, "read"}, {1002, "open"}, {1002, "close"},
	}

	// BPF map disimulasikan sebagai map Go: key = PID, value = jumlah syscall.
	bpfMap := map[int]int{}
	for _, e := range events {
		bpfMap[e.PID]++ // program di kernel menaikkan counter
	}

	// User space membaca map (urutkan key biar output stabil).
	pids := make([]int, 0, len(bpfMap))
	for pid := range bpfMap {
		pids = append(pids, pid)
	}
	sort.Ints(pids)
	for _, pid := range pids {
		fmt.Printf("PID %d: %d syscall\\n", pid, bpfMap[pid])
	}
}
`,
    expectedOutput: "PID 1001: 3 syscall\nPID 1002: 3 syscall",
  },
  {
    slug: "ebpf-go",
    title: "eBPF dari Go (cilium/ebpf)",
    order: 15,
    summary: "load, attach, dan baca map pakai cilium/ebpf",
    lessonMarkdown: `
Di Go, library paling populer untuk eBPF adalah [\`github.com/cilium/ebpf\`](https://github.com/cilium/ebpf). Alurnya:

1. Tulis program eBPF dalam **C**, lalu \`bpf2go\` meng-compile-nya jadi object \`.o\` sekaligus membuat kode Go pembungkusnya.
2. Di Go, panggil \`LoadObjects\` untuk memuat program + map ke kernel.
3. **Attach** program ke hook (mis. XDP di sebuah interface).
4. Loop di user space membaca **map** atau **ring buffer** untuk mengambil hasilnya.

\`\`\`go
// CONTOH ILUSTRATIF — TIDAK BISA dijalankan di panel ini.
// Butuh root + kernel Linux + object eBPF hasil bpf2go.
package main

import (
	"github.com/cilium/ebpf/link"
	"github.com/cilium/ebpf/rlimit"
)

func main() {
	rlimit.RemoveMemlock()

	var objs counterObjects           // dibuat oleh bpf2go
	loadCounterObjects(&objs, nil)     // load program + map ke kernel
	defer objs.Close()

	l, _ := link.AttachXDP(link.XDPOptions{
		Program:   objs.CountPackets,  // program eBPF
		Interface: 2,                   // index interface (mis. eth0)
	})
	defer l.Close()

	// user space baca map objs.PktCount secara periodik...
}
\`\`\`

Karena butuh root + kernel, kita **tiru bagian user space-nya** saja: baca event dari sebuah "ring buffer" (di sini slice), agregasi byte per alamat IP, lalu tampilkan *top talkers* terurut dari yang terbesar.

Tugas: jalankan kode di samping — ia menjumlahkan byte per IP dan mengurutkannya dari yang paling banyak.
`,
    starterCode: `package main

import (
	"fmt"
	"sort"
)

// Di produksi, user space membaca event dari ring buffer yang diisi
// program eBPF di kernel. Di sini kita tiru dengan slice.
type Conn struct {
	Src   string
	Bytes int
}

func main() {
	ringBuffer := []Conn{
		{"10.0.0.1", 500}, {"10.0.0.2", 200},
		{"10.0.0.1", 300}, {"10.0.0.3", 100},
		{"10.0.0.2", 400},
	}

	traffic := map[string]int{}
	for _, c := range ringBuffer {
		traffic[c.Src] += c.Bytes
	}

	type row struct {
		ip string
		b  int
	}
	rows := make([]row, 0, len(traffic))
	for ip, b := range traffic {
		rows = append(rows, row{ip, b})
	}
	sort.Slice(rows, func(i, j int) bool { return rows[i].b > rows[j].b })
	for _, r := range rows {
		fmt.Printf("%s -> %d bytes\\n", r.ip, r.b)
	}
}
`,
    solutionCode: `package main

import (
	"fmt"
	"sort"
)

// Di produksi, user space membaca event dari ring buffer yang diisi
// program eBPF di kernel. Di sini kita tiru dengan slice.
type Conn struct {
	Src   string
	Bytes int
}

func main() {
	ringBuffer := []Conn{
		{"10.0.0.1", 500}, {"10.0.0.2", 200},
		{"10.0.0.1", 300}, {"10.0.0.3", 100},
		{"10.0.0.2", 400},
	}

	traffic := map[string]int{}
	for _, c := range ringBuffer {
		traffic[c.Src] += c.Bytes
	}

	type row struct {
		ip string
		b  int
	}
	rows := make([]row, 0, len(traffic))
	for ip, b := range traffic {
		rows = append(rows, row{ip, b})
	}
	sort.Slice(rows, func(i, j int) bool { return rows[i].b > rows[j].b })
	for _, r := range rows {
		fmt.Printf("%s -> %d bytes\\n", r.ip, r.b)
	}
}
`,
    expectedOutput: "10.0.0.1 -> 800 bytes\n10.0.0.2 -> 600 bytes\n10.0.0.3 -> 100 bytes",
  },
];

const codingChallengeGuides: Record<string, string> = {
  "tentang-go": [
    "### Persiapan coding challenge",
    "",
    "Challenge bab ini meminta kamu membuat program kecil yang membaca satu nama dari input, lalu mencetak sapaan. Fokusnya adalah alur sederhana: input masuk, diproses, lalu output keluar.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: satu nama, misalnya Budi.",
    "- Output: Halo, Budi!.",
    "- Jangan mencetak teks tambahan seperti Masukkan nama:, karena output quiz harus cocok persis.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Pastikan program memakai package main dan punya func main().",
    "2. Import tiga paket yang diperlukan: bufio untuk membaca per baris, fmt untuk mencetak, dan os untuk mengakses input standar.",
    "3. Buat scanner dari os.Stdin.",
    "4. Panggil scanner.Scan() untuk membaca satu baris, lalu ambil teksnya dengan scanner.Text().",
    "5. Simpan hasil bacaan ke variabel, kemudian cetak sapaan dengan tanda seru menempel pada nama.",
    "",
    "Contoh potongan penting:",
    "",
    "    scanner := bufio.NewScanner(os.Stdin)",
    "    scanner.Scan()",
    "    nama := scanner.Text()",
    "",
    "Setelah itu, bentuk output dengan pola fmt.Println(\"Halo,\", nama+\"!\"). Tanda + menggabungkan nama dan tanda seru menjadi satu string.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- scanner.Text() dipanggil dengan tanda kurung.",
    "- Semua paket yang dipakai sudah ada di import.",
    "- Program membaca input sebelum mencetak output.",
    "- Output hanya satu baris dan formatnya tepat.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis scanner.Text tanpa (), sehingga yang dipakai bukan hasil teksnya.",
    "- Lupa mengimpor bufio atau os.",
    "- Menggunakan fmt.Scan padahal challenge ini melatih bufio.Scanner.",
  ].join("\n"),
  "hello-go": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini meminta program sapaan yang membaca satu nama dari stdin. Kamu tidak perlu membuat program baru dari nol; starter code sudah menyiapkan package, import, dan fungsi main.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: satu kata, misalnya Ayu.",
    "- Output: Halo, Ayu!.",
    "- Teks output harus memakai Halo,, satu spasi, nama, lalu !.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Siapkan variabel teks: var nama string.",
    "2. Baca input dengan fmt.Scan(&nama). Tanda & memberi tahu Scan tempat untuk menaruh nilai yang dibaca.",
    "3. Gabungkan tanda seru ke nama dengan operator +. Jika nama berisi Ayu, maka nama + \"!\" menghasilkan Ayu!.",
    "4. Cetak dua bagian dengan fmt.Println: \"Halo,\" dan string nama yang sudah digabungkan.",
    "",
    "    var nama string",
    "    fmt.Scan(&nama)",
    "    fmt.Println(\"Halo,\", nama+\"!\")",
    "",
    "fmt.Println memberi spasi di antara argumen. Karena itu, tanda seru digabungkan ke nama terlebih dahulu. Jika kamu menulis fmt.Println(\"Halo,\", nama, \"!\"), hasilnya menjadi Halo, Ayu ! dengan spasi yang tidak diinginkan.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Nama variabel bertipe string.",
    "- fmt.Scan menerima &nama, bukan hanya nama.",
    "- Tanda seru menempel pada nama.",
    "- Tidak ada prompt tambahan atau output kedua.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis nama + ! tanpa tanda kutip; tanda seru harus berupa string \"!\".",
    "- Menulis fmt.Println(\"Halo,\", nama, \"!\"), yang menghasilkan spasi sebelum tanda seru.",
  ].join("\n"),
  "variabel-tipe": [
    "### Persiapan coding challenge",
    "",
    "Di challenge ini kamu membaca dua nilai dengan tipe berbeda: nama berupa string dan umur berupa int. Setelah itu, cetak masing-masing dengan label yang sudah ditentukan.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: nama dan umur, dipisahkan spasi. Contoh: Budi 20.",
    "- Output:",
    "",
    "    Nama: Budi",
    "    Umur: 20",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Deklarasikan nama sebagai string dan umur sebagai int.",
    "2. Panggil fmt.Scan(&nama, &umur) agar dua nilai dibaca berurutan.",
    "3. Cetak baris pertama dengan label Nama: dan nilai nama.",
    "4. Cetak baris kedua dengan label Umur: dan nilai umur.",
    "",
    "    var nama string",
    "    var umur int",
    "    fmt.Scan(&nama, &umur)",
    "",
    "fmt.Scan mengenali tipe variabel: teks masuk ke string, angka masuk ke int. Tanda & tetap diperlukan agar fungsi dapat mengisi variabel.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- nama bertipe string, bukan int.",
    "- umur bertipe int, bukan string.",
    "- Label ditulis persis Nama: dan Umur:.",
    "- Nama dan umur dicetak pada dua baris berbeda.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis fmt.Scan(nama, umur) tanpa &.",
    "- Mencetak keduanya dalam satu baris.",
    "- Menambahkan kata atau prompt yang tidak diminta.",
  ].join("\n"),
  "simbol-operator": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini hanya membutuhkan dua operator aritmatika: + untuk menjumlahkan dan % untuk mengambil sisa pembagian.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: dua bilangan bulat a dan b, misalnya 17 5.",
    "- Output:",
    "",
    "    Jumlah: 22",
    "    Sisa: 2",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Gunakan variabel a dan b bertipe int, lalu baca keduanya dengan fmt.Scan(&a, &b).",
    "2. Hitung jumlah menggunakan ekspresi a + b.",
    "3. Hitung sisa bagi menggunakan ekspresi a % b. Operator % bukan persen; ia menghasilkan sisa pembagian.",
    "4. Cetak hasil dengan fmt.Println, memakai label yang tepat.",
    "",
    "    fmt.Println(\"Jumlah:\", a+b)",
    "    fmt.Println(\"Sisa:\", a%b)",
    "",
    "Untuk contoh 17 5, 17 + 5 bernilai 22, sedangkan 17 % 5 bernilai 2 karena 17 dibagi 5 menyisakan 2.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Operator jumlah adalah +, bukan *.",
    "- Operator sisa adalah %.",
    "- Nilai b dibaca dari input dan tidak nol pada test.",
    "- Label output dan urutan baris sama dengan instruksi.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis a / b saat yang diminta adalah sisa bagi.",
    "- Menulis a % b sebagai teks di dalam tanda kutip sehingga tidak dihitung.",
    "- Lupa spasi setelah label; fmt.Println(\"Jumlah:\", nilai) sudah memberi spasi otomatis.",
  ].join("\n"),
  "kontrol-alur": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini memakai pola accumulator: siapkan variabel total, lalu tambahkan setiap angka dari 1 sampai n.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: satu bilangan bulat n, misalnya 5.",
    "- Output untuk contoh tersebut: Total: 15, karena 1 + 2 + 3 + 4 + 5 = 15.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Baca n dengan fmt.Scan(&n).",
    "2. Mulai total dari 0. Nilai ini akan menyimpan hasil sementara.",
    "3. Buat loop dengan nilai awal i := 1, lanjut selama i <= n, lalu naikkan i satu per satu.",
    "4. Di dalam loop, tambahkan i ke total dengan total += i.",
    "5. Setelah loop selesai, cetak fmt.Println(\"Total:\", total).",
    "",
    "    total := 0",
    "    for i := 1; i <= n; i++ {",
    "        total += i",
    "    }",
    "",
    "Perhatikan batas loop: gunakan i <= n, bukan i < n, karena angka n juga harus ikut dijumlahkan.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- total dimulai dari nol.",
    "- Loop dimulai dari angka 1.",
    "- Kondisinya mencakup angka n.",
    "- i bertambah agar loop berhenti.",
    "- Output dicetak setelah loop, bukan setiap putaran.",
    "",
    "**Kesalahan umum**",
    "",
    "- Memulai dari i := 0, padahal yang diminta 1 sampai n.",
    "- Memakai i < n, sehingga angka terakhir terlewat.",
    "- Menimpa total dengan total = i dan kehilangan hasil sebelumnya.",
  ].join("\n"),
  "fungsi": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini melatih pemisahan pekerjaan: fungsi tambah menghitung, sedangkan main membaca input dan mencetak hasil.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: dua bilangan bulat, misalnya 3 4.",
    "- Output: Hasil: 7.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Buat fungsi bernama tambah dengan dua parameter bertipe int.",
    "2. Tulis tipe hasil int setelah tanda kurung parameter.",
    "3. Di dalam fungsi, kembalikan a + b dengan return.",
    "4. Di main, baca dua angka ke variabel a dan b.",
    "5. Panggil tambah(a, b) sebagai nilai yang dicetak.",
    "",
    "    func tambah(a, b int) int {",
    "        return a + b",
    "    }",
    "",
    "Panggilan fungsi menghasilkan nilai, jadi bisa langsung dipakai sebagai argumen kedua:",
    "",
    "    fmt.Println(\"Hasil:\", tambah(a, b))",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Nama fungsi tepat tambah.",
    "- Kedua parameter bertipe int.",
    "- Fungsi memiliki return bertipe int.",
    "- main mengirim a dan b ke fungsi.",
    "- Label output adalah Hasil:.",
    "",
    "**Kesalahan umum**",
    "",
    "- Lupa menulis return.",
    "- Menulis func tambah(a, b) int tanpa tipe parameter.",
    "- Memanggil fungsi dengan nilai tetap, bukan nilai dari input.",
  ].join("\n"),
  "koleksi": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini membaca banyak angka ke dalam slice, lalu menjumlahkan semua isinya. Nilai pertama pada input memberi tahu berapa banyak angka yang harus dibaca.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: n, lalu n angka. Contoh: 3 1 2 3.",
    "- Output: Total: 6.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Baca jumlah data ke variabel n.",
    "2. Buat slice dengan panjang n: angka := make([]int, n).",
    "3. Gunakan for i := range angka agar setiap posisi diisi satu kali.",
    "4. Baca nilai ke posisi tersebut dengan fmt.Scan(&angka[i]).",
    "5. Buat total := 0, lalu ulangi isi slice dengan for _, nilai := range angka.",
    "6. Tambahkan setiap nilai ke total, kemudian cetak hasilnya.",
    "",
    "    angka := make([]int, n)",
    "    for i := range angka {",
    "        fmt.Scan(&angka[i])",
    "    }",
    "",
    "Pada range, variabel pertama adalah index dan variabel kedua adalah nilai. Saat hanya membutuhkan nilai, gunakan _ untuk membuang index:",
    "",
    "    for _, nilai := range angka {",
    "        total += nilai",
    "    }",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Panjang slice berasal dari n.",
    "- Input masuk ke angka[i], bukan selalu ke posisi yang sama.",
    "- Semua nilai dijumlahkan setelah selesai dibaca.",
    "- Output memakai label Total:.",
    "",
    "**Kesalahan umum**",
    "",
    "- Membuat slice dengan panjang tetap, padahal n dapat berubah.",
    "- Menulis fmt.Scan(angka[i]) tanpa &.",
    "- Menggunakan index sebagai nilai saat menjumlahkan.",
  ].join("\n"),
  "struct-method": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini meminta sebuah Persegi menghitung luas melalui method. Starter code sudah menyediakan struct, receiver, dan alur main.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: satu angka desimal sebagai sisi, misalnya 2.5.",
    "- Output: Luas: 6.25.",
    "- Output selalu menampilkan dua angka di belakang koma.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Biarkan field Sisi bertipe float64, karena input dapat berupa angka desimal.",
    "2. Method harus memiliki receiver p Persegi, nama Luas, dan return type float64.",
    "3. Hitung luas dengan mengalikan p.Sisi dengan p.Sisi.",
    "4. Di main, baca sisi, buat Persegi{Sisi: sisi}, lalu panggil method-nya.",
    "5. Gunakan fmt.Printf(\"Luas: %.2f\", nilai) agar formatnya tepat.",
    "",
    "    func (p Persegi) Luas() float64 {",
    "        return p.Sisi * p.Sisi",
    "    }",
    "",
    "%.2f berarti angka pecahan dicetak dengan tepat dua digit desimal. Jadi luas 16 tampil sebagai 16.00.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Receiver membaca field dengan p.Sisi.",
    "- Return type method adalah float64.",
    "- Rumusnya sisi dikali sisi.",
    "- Format output menggunakan %.2f.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menggunakan fmt.Println, sehingga jumlah desimal tidak selalu dua.",
    "- Menulis p.Sisi + p.Sisi, padahal luas memakai perkalian.",
    "- Mengubah nama method atau receiver sehingga pemanggilan p.Luas() tidak cocok.",
  ].join("\n"),
  "pointer": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini meminta fungsi gandakan mengubah nilai x yang asli. Karena fungsi harus mengubah variabel milik pemanggil, fungsi menerima pointer.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: satu bilangan bulat, misalnya 5.",
    "- Output: Hasil: 10.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Parameter fungsi ditulis n *int. Artinya n menyimpan alamat dari sebuah int.",
    "2. Di dalam fungsi, gunakan *n untuk membuka alamat tersebut dan mendapatkan nilai aslinya.",
    "3. Kalikan nilai itu dengan 2 dan simpan kembali ke *n.",
    "4. Di main, baca x, lalu kirim alamatnya dengan gandakan(&x).",
    "5. Cetak x setelah fungsi selesai.",
    "",
    "    func gandakan(n *int) {",
    "        *n = *n * 2",
    "    }",
    "",
    "    gandakan(&x)",
    "",
    "&x berarti alamat variabel x. *n berarti nilai yang berada di alamat tersebut. Jadi fungsi tidak mengubah salinan, melainkan x yang asli.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Parameter fungsi bertipe *int.",
    "- Nilai yang diubah adalah *n, bukan hanya n.",
    "- Pemanggilan fungsi memakai &x.",
    "- Output dicetak setelah gandakan selesai.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis gandakan(x), padahal fungsi meminta alamat.",
    "- Menulis n = n * 2; n adalah alamat, bukan nilai int yang ingin dikalikan.",
    "- Lupa tanda * saat membaca atau mengubah nilai yang ditunjuk.",
  ].join("\n"),
  "interface": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini menggabungkan struct Lingkaran dengan interface Bentuk. Kunci utamanya adalah signature method harus sama persis dengan kontrak interface.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: jari-jari lingkaran, misalnya 2.",
    "- Output: Luas: 12.56.",
    "- Gunakan pi 3.14 dan cetak dua angka desimal.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Interface Bentuk meminta satu method: Luas() float64.",
    "2. Struct Lingkaran menyimpan field Jari bertipe float64.",
    "3. Buat method Luas pada Lingkaran dengan receiver l Lingkaran dan hasil float64.",
    "4. Di method, gunakan rumus 3.14 * l.Jari * l.Jari.",
    "5. main sudah menyimpan Lingkaran ke variabel b bertipe Bentuk. Panggil b.Luas() untuk mendapatkan hasil.",
    "",
    "    func (l Lingkaran) Luas() float64 {",
    "        return 3.14 * l.Jari * l.Jari",
    "    }",
    "",
    "Tidak ada keyword implements di Go. Lingkaran otomatis memenuhi Bentuk karena memiliki method Luas dengan nama, parameter, dan return type yang sesuai.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Nama method adalah Luas.",
    "- Method tidak menerima parameter tambahan.",
    "- Return type adalah float64.",
    "- Rumus memakai 3.14 dan l.Jari dua kali.",
    "- Format output memakai %.2f.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis Luas(jari float64), padahal interface meminta Luas() tanpa parameter.",
    "- Mengembalikan int, sehingga signature tidak cocok.",
    "- Menggunakan math.Pi, padahal challenge secara khusus meminta 3.14.",
  ].join("\n"),
  "konkurensi": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini membuat satu goroutine untuk setiap angka dari 0 sampai n-1. Setiap goroutine mengirim kuadratnya ke channel, lalu main menjumlahkan semua nilai.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: satu bilangan n, misalnya 5.",
    "- Angka yang diproses adalah 0, 1, 2, 3, dan 4.",
    "- Output: Total: 30.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Starter code sudah membuat channel dan WaitGroup.",
    "2. Di setiap putaran loop, panggil wg.Add(1) sebelum membuat goroutine.",
    "3. Goroutine menerima salinan i sebagai parameter, lalu menjalankan defer wg.Done().",
    "4. Kirim nilai n * n ke channel dengan operator <-.",
    "5. Setelah semua goroutine dibuat, panggil wg.Wait().",
    "6. Tutup channel dengan close(ch), lalu gunakan for value := range ch untuk menjumlahkan hasil.",
    "",
    "Pola goroutine di dalam loop:",
    "",
    "    wg.Add(1)",
    "    go func(nilai int) {",
    "        defer wg.Done()",
    "        ch <- nilai * nilai",
    "    }(i)",
    "",
    "Urutannya penting: jangan menutup channel sebelum semua pengirim selesai. WaitGroup memastikan semua goroutine sudah memanggil Done sebelum close(ch).",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Add dipanggil satu kali untuk setiap goroutine.",
    "- Done tetap dipanggil meskipun goroutine selesai lebih awal.",
    "- Nilai i dikirim sebagai parameter fungsi anonim.",
    "- Wait dilakukan sebelum channel ditutup.",
    "- Semua nilai dari channel dijumlahkan.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis go func() { ... } tanpa mengirim i sebagai parameter, sehingga loop variable dapat terbaca tidak sesuai.",
    "- Memanggil close(ch) terlalu cepat.",
    "- Lupa mengimpor sync atau lupa menggunakan WaitGroup.",
  ].join("\n"),
  "capstone": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini meminta method RataRata menghitung rata-rata tiga nilai yang disimpan dalam slice di dalam struct Siswa.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: tiga bilangan bulat, misalnya 80 90 100.",
    "- Output: Rata-rata: 90.00.",
    "- Hasil harus memiliki dua angka desimal.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Starter code membaca tiga angka ke slice nilai.",
    "2. Method menerima receiver s Siswa, sehingga isi slice dapat diakses lewat s.Nilai.",
    "3. Mulai total dari 0.",
    "4. Ulangi s.Nilai dengan range dan tambahkan setiap nilai ke total.",
    "5. Bagi total dengan jumlah data. Ubah keduanya ke float64 agar pembagian menghasilkan pecahan.",
    "6. Cetak hasil dengan format %.2f.",
    "",
    "    func (s Siswa) RataRata() float64 {",
    "        total := 0",
    "        for _, nilai := range s.Nilai {",
    "            total += nilai",
    "        }",
    "        return float64(total) / float64(len(s.Nilai))",
    "    }",
    "",
    "Mengubah total dan len(s.Nilai) ke float64 penting. Jika dua-duanya int, pembagian dapat membuang bagian desimal sebelum dicetak.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Loop membaca semua isi s.Nilai.",
    "- Total dimulai dari nol dan memakai +=.",
    "- Return type method adalah float64.",
    "- Pembagian memakai float64(total) dan float64(len(s.Nilai)).",
    "- Output memakai label Rata-rata: dan %.2f.",
    "",
    "**Kesalahan umum**",
    "",
    "- Membagi hanya dengan angka 3; gunakan panjang slice agar logikanya mengikuti data.",
    "- Mengembalikan total sebagai int.",
    "- Lupa mengubah int menjadi float64 sehingga hasil 7 dibagi 3 menjadi 2, bukan 2.33.",
  ].join("\n"),
  "ebpf-pengantar": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini adalah simulasi aman dari penghitung event eBPF. Kamu tidak perlu mengakses kernel; cukup gunakan map Go untuk menghitung berapa kali setiap protokol muncul.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: n, lalu n nama protokol. Contoh: 3 tcp udp tcp.",
    "- Output selalu dicetak dalam urutan icmp, tcp, lalu udp.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Starter code sudah membuat counter sebagai map[string]int.",
    "2. Ulangi pembacaan sebanyak n kali.",
    "3. Pada setiap putaran, baca proto.",
    "4. Naikkan counter untuk protokol tersebut dengan counter[proto]++.",
    "5. Cetak counter[\"icmp\"], counter[\"tcp\"], dan counter[\"udp\"] dengan label yang sesuai.",
    "",
    "    counter := map[string]int{}",
    "    counter[proto]++",
    "",
    "Saat sebuah key belum ada, nilai int dari map terbaca sebagai 0. Karena itu, counter[proto]++ bisa langsung dipakai tanpa membuat key lebih dulu.",
    "",
    "Ingat bahwa contoh ini hanya simulasi aliran event. Program eBPF asli membutuhkan kernel dan privilege, sedangkan challenge cukup memakai Go standard library.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Loop berjalan tepat n kali.",
    "- Setiap proto dibaca sebelum counter dinaikkan.",
    "- Key map memakai nilai proto, bukan teks tetap.",
    "- Tiga baris output dicetak dengan urutan dan label yang tepat.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menaikkan counter di luar loop, sehingga hanya event terakhir yang dihitung.",
    "- Membuat counter baru di setiap putaran loop.",
    "- Mengurutkan output berdasarkan map; challenge meminta urutan label tetap.",
  ].join("\n"),
  "ebpf-maps": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini meniru BPF map dengan map[int]int. Kamu perlu mengagregasikan jumlah event per PID, lalu mengurutkan PID sebelum mencetaknya.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: n, lalu n PID integer. Contoh: 6 1001 1001 1002 1001 1002 1002.",
    "- Output satu baris untuk setiap PID unik, dari angka terkecil ke terbesar.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Untuk setiap PID yang dibaca, naikkan counter[pid]++.",
    "2. Buat slice pids dengan kapasitas len(counter).",
    "3. Iterasi key map dan tambahkan setiap pid ke slice.",
    "4. Panggil sort.Ints(pids) agar urut dari kecil ke besar.",
    "5. Iterasi pids yang sudah terurut dan cetak fmt.Printf(\"PID %d: %d\\n\", pid, counter[pid]).",
    "",
    "    counter := map[int]int{}",
    "    counter[pid]++",
    "",
    "    pids := make([]int, 0, len(counter))",
    "    for pid := range counter {",
    "        pids = append(pids, pid)",
    "    }",
    "    sort.Ints(pids)",
    "",
    "Map tidak menjamin urutan saat diiterasi. Karena itu, jangan langsung mencetak di dalam for range map jika output harus konsisten.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Counter dikelompokkan berdasarkan PID.",
    "- PID yang sama dihitung lebih dari sekali.",
    "- Semua key map dikumpulkan ke slice.",
    "- sort.Ints dipanggil sebelum output.",
    "- Format output adalah PID <pid>: <jumlah>.",
    "",
    "**Kesalahan umum**",
    "",
    "- Mengurutkan nilai counter, padahal yang diminta adalah PID.",
    "- Menghilangkan PID yang muncul lebih dari sekali.",
    "- Lupa mengimpor sort.",
  ].join("\n"),
  "ebpf-go": [
    "### Persiapan coding challenge",
    "",
    "Challenge ini meniru bagian user space dari program eBPF: baca event koneksi, jumlahkan bytes untuk setiap IP, lalu urutkan hasilnya.",
    "",
    "**Bentuk input dan output**",
    "",
    "- Input: n pasangan IP dan bytes. Contoh: 5 10.0.0.1 500 10.0.0.2 200 ...",
    "- Output: IP dengan total bytes terbesar dicetak lebih dulu.",
    "- Jika total bytes sama, IP diurutkan secara ascending.",
    "",
    "**Langkah pengerjaan**",
    "",
    "1. Baca ip dan bytes sebanyak n kali.",
    "2. Agregasikan dengan traffic[ip] += bytes. IP yang sama harus menambah total lama.",
    "3. Ubah isi map menjadi slice Row agar bisa diurutkan.",
    "4. Gunakan sort.Slice dengan dua aturan: Bytes lebih besar berada lebih dulu; jika sama, IP yang lebih kecil secara string berada lebih dulu.",
    "5. Cetak setiap row dengan format %s -> %d.",
    "",
    "Bagian agregasi:",
    "",
    "    traffic := map[string]int{}",
    "    traffic[ip] += bytes",
    "",
    "Bentuk comparator:",
    "",
    "    sort.Slice(rows, func(i, j int) bool {",
    "        if rows[i].Bytes == rows[j].Bytes {",
    "            return rows[i].IP < rows[j].IP",
    "        }",
    "        return rows[i].Bytes > rows[j].Bytes",
    "    })",
    "",
    "Map tidak bisa langsung diurutkan. Karena itu, kumpulkan pasangan IP dan total bytes ke slice Row terlebih dahulu.",
    "",
    "**Checklist sebelum mengecek jawaban**",
    "",
    "- Bytes dari IP yang sama dijumlahkan, bukan ditimpa.",
    "- Semua key map masuk ke rows.",
    "- Urutan utama berdasarkan Bytes menurun.",
    "- Saat bytes sama, urutan berdasarkan IP menaik.",
    "- Output tidak menambahkan kata bytes.",
    "",
    "**Kesalahan umum**",
    "",
    "- Menulis traffic[ip] = bytes sehingga data sebelumnya hilang.",
    "- Comparator hanya membandingkan bytes dan tidak menangani nilai yang sama.",
    "- Mengurutkan IP lebih dulu sehingga traffic terbesar tidak selalu berada di atas.",
  ].join("\n"),
};

for (const chapter of chapters) {
  const guide = codingChallengeGuides[chapter.slug];
  if (guide) {
    chapter.lessonMarkdown = chapter.lessonMarkdown.trimEnd() + "\n\n" + guide + "\n";
  }
}

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getChapterSections(chapter: Chapter): ChapterSection[] {
  const sections: ChapterSection[] = [];
  const usedIds = new Map<string, number>();
  const headingPattern = /^###\s+(.+?)\s*$/gm;

  for (const match of chapter.lessonMarkdown.matchAll(headingPattern)) {
    const title = cleanHeadingTitle(match[1]);
    const baseId = slugifyHeading(title) || "bagian";
    const occurrence = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, occurrence + 1);

    sections.push({
      id: occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`,
      title,
      sourceOffset: match.index ?? 0,
    });
  }

  return sections;
}

function cleanHeadingTitle(title: string): string {
  return title.replace(/[`*_~]/g, "").trim();
}

function slugifyHeading(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function chapterNeighbors(slug: string): {
  prev: Chapter | null;
  next: Chapter | null;
} {
  const idx = chapters.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null,
  };
}
