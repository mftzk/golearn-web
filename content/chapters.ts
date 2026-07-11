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

export const chapters: Chapter[] = [
  {
    slug: "hello-go",
    title: "Hello, Go",
    order: 1,
    summary: "package main, fungsi main, dan fmt.Println",
    lessonMarkdown: `
Setiap program Go dimulai dari **package**. Program yang bisa dijalankan langsung harus berada di \`package main\`, dan harus punya fungsi \`func main()\` — itu adalah titik masuk (entry point) program.

Untuk mencetak sesuatu ke layar, kita pakai paket standar \`fmt\` (format) dan fungsi \`fmt.Println\`.

\`\`\`go
package main

import "fmt"

func main() {
	fmt.Println("Halo, Go!")
}
\`\`\`

Coba jalankan kode di sebelah kanan. Lalu ubah teksnya jadi namamu sendiri, dan jalankan lagi.
`,
    starterCode: `package main

import "fmt"

func main() {
	fmt.Println("Halo, Go!")
}
`,
    solutionCode: `package main

import "fmt"

func main() {
	fmt.Println("Halo, Go!")
}
`,
    expectedOutput: "Halo, Go!",
  },
  {
    slug: "variabel-tipe",
    title: "Variabel & Tipe Data",
    order: 2,
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
    slug: "kontrol-alur",
    title: "Kontrol Alur",
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
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

Jalankan kode di samping untuk melihat hasilnya. Ini adalah bab terakhir — selamat, kamu sudah menyelesaikan dasar-dasar Go!
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
];

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
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
