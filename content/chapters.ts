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
    slug: "simbol-operator",
    title: "Simbol & Operator",
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
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
    order: 11,
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
    order: 12,
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
    order: 13,
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
    order: 14,
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
