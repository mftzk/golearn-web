export const QUIZ_PASSING_SCORE = 80;

export interface QuizOption {
  id: string;
  label: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: "multiple_choice";
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: "true_false";
  prompt: string;
  correctAnswer: boolean;
  explanation: string;
}

export interface CodingTest {
  stdin: string;
  expectedOutput: string;
}

export interface CodingQuestion {
  id: string;
  type: "coding";
  prompt: string;
  instructions: string;
  starterCode: string;
  tests: CodingTest[];
  explanation: string;
}

export interface MiniProjectFile {
  name: string;
  starterCode: string;
}

export interface MiniProjectTest {
  stdin: string;
  expectedOutput: string;
}

export interface MiniProjectQuiz {
  slug: string;
  kind: "mini_project";
  title: string;
  description: string;
  instructions: string;
  files: MiniProjectFile[];
  sampleInput: string;
  tests: MiniProjectTest[];
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | CodingQuestion;

export type QuizDefinition = ChapterQuiz | MiniProjectQuiz;

export interface ChapterQuiz {
  chapterSlug: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export type PublicQuizQuestion =
  | Omit<MultipleChoiceQuestion, "correctOptionId" | "explanation">
  | Omit<TrueFalseQuestion, "correctAnswer" | "explanation">
  | Omit<CodingQuestion, "tests" | "explanation">;

export interface PublicChapterQuiz {
  chapterSlug: string;
  title: string;
  description: string;
  questions: PublicQuizQuestion[];
}

export interface PublicMiniProjectFile {
  name: string;
  content: string;
}

export interface PublicMiniProject {
  slug: string;
  kind: "mini_project";
  title: string;
  description: string;
  instructions: string;
  files: PublicMiniProjectFile[];
  sampleInput: string;
}

export type QuizAnswer = string | boolean;

const code = String.raw;

export const quizzes: ChapterQuiz[] = [
  {
    chapterSlug: "tentang-go",
    title: "Quiz: Tentang Go",
    description: "Cek pemahamanmu tentang asal-usul dan cara kerja Go.",
    questions: [
      {
        id: "tentang-go-1",
        type: "multiple_choice",
        prompt: "Manakah yang paling tepat menggambarkan Go?",
        options: [
          { id: "a", label: "Bahasa yang selalu diinterpretasi saat runtime" },
          { id: "b", label: "Bahasa statically typed yang dikompilasi ke binary native" },
          { id: "c", label: "Bahasa yang hanya berjalan di virtual machine" },
          { id: "d", label: "Bahasa markup untuk konfigurasi server" },
        ],
        correctOptionId: "b",
        explanation: "Go memeriksa tipe saat kompilasi dan menghasilkan binary native.",
      },
      {
        id: "tentang-go-2",
        type: "multiple_choice",
        prompt: "Siapa tiga perancang awal Go?",
        options: [
          { id: "a", label: "Robert Griesemer, Rob Pike, dan Ken Thompson" },
          { id: "b", label: "Dennis Ritchie, Bjarne Stroustrup, dan Guido van Rossum" },
          { id: "c", label: "James Gosling, Brendan Eich, dan Anders Hejlsberg" },
          { id: "d", label: "Linus Torvalds, Brian Kernighan, dan Russ Cox" },
        ],
        correctOptionId: "a",
        explanation: "Go mulai dirancang oleh Robert Griesemer, Rob Pike, dan Ken Thompson.",
      },
      {
        id: "tentang-go-3",
        type: "multiple_choice",
        prompt: "Pernyataan mana yang benar tentang runtime Go?",
        options: [
          { id: "a", label: "Runtime Go adalah Java Virtual Machine" },
          { id: "b", label: "Runtime Go hanya berisi garbage collector" },
          { id: "c", label: "Runtime Go membantu scheduler, garbage collector, dan manajemen stack" },
          { id: "d", label: "Runtime Go harus mengunduh compiler saat program dijalankan" },
        ],
        correctOptionId: "c",
        explanation: "Program tetap native; runtime Go menyediakan layanan seperti scheduler dan garbage collector.",
      },
      {
        id: "tentang-go-4",
        type: "true_false",
        prompt: "Program Go harus berjalan di virtual machine seperti Java agar bisa dieksekusi.",
        correctAnswer: false,
        explanation: "Go dikompilasi menjadi kode mesin native dan tidak membutuhkan virtual machine.",
      },
      {
        id: "tentang-go-5",
        type: "coding",
        prompt: "Tulis program kecil yang menunjukkan bahwa program Go dapat menerima input dan menghasilkan output.",
        instructions: "Baca satu nama dari stdin, lalu cetak `Halo, <nama>!`.",
        starterCode: code`package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	nama := scanner.Text()
	fmt.Println("Halo,", nama+"!")
}
`,
        tests: [
          { stdin: "Budi\n", expectedOutput: "Halo, Budi!" },
          { stdin: "Go\n", expectedOutput: "Halo, Go!" },
          { stdin: "Dunia\n", expectedOutput: "Halo, Dunia!" },
        ],
        explanation: "Program Go native tetap dapat membaca input standar dan menulis output standar.",
      },
    ],
  },
  {
    chapterSlug: "hello-go",
    title: "Quiz: Hello, Go",
    description: "Latihan dasar package, main, dan fmt.Println.",
    questions: [
      {
        id: "hello-go-1",
        type: "multiple_choice",
        prompt: "Package apa yang dipakai oleh program Go yang bisa dijalankan langsung?",
        options: [
          { id: "a", label: "package run" },
          { id: "b", label: "package main" },
          { id: "c", label: "package executable" },
          { id: "d", label: "package app" },
        ],
        correctOptionId: "b",
        explanation: "Program executable harus menggunakan package main.",
      },
      {
        id: "hello-go-2",
        type: "multiple_choice",
        prompt: "Fungsi mana yang umum dipakai untuk mencetak baris teks?",
        options: [
          { id: "a", label: "fmt.Println" },
          { id: "b", label: "print.Line" },
          { id: "c", label: "console.log" },
          { id: "d", label: "io.WriteLine" },
        ],
        correctOptionId: "a",
        explanation: "fmt.Println mencetak nilai lalu menambahkan newline.",
      },
      {
        id: "hello-go-3",
        type: "multiple_choice",
        prompt: "Apa fungsi `func main()` pada program executable?",
        options: [
          { id: "a", label: "Mendeklarasikan tipe data utama" },
          { id: "b", label: "Menjadi titik masuk program" },
          { id: "c", label: "Mengaktifkan garbage collector" },
          { id: "d", label: "Mengunduh dependency" },
        ],
        correctOptionId: "b",
        explanation: "Eksekusi program dimulai dari fungsi main dalam package main.",
      },
      {
        id: "hello-go-4",
        type: "true_false",
        prompt: "Package main dan fungsi main diperlukan untuk membuat program Go executable.",
        correctAnswer: true,
        explanation: "Keduanya adalah konvensi entry point untuk program yang dapat dijalankan.",
      },
      {
        id: "hello-go-5",
        type: "coding",
        prompt: "Buat program sapaan yang bisa dipakai untuk banyak nama.",
        instructions: "Baca satu nama dari stdin dan cetak `Halo, <nama>!`.",
        starterCode: code`package main

import (
	"fmt"
)

func main() {
	var nama string
	fmt.Scan(&nama)
	// TODO: cetak sapaan untuk nama
}
`,
        tests: [
          { stdin: "Ayu\n", expectedOutput: "Halo, Ayu!" },
          { stdin: "Raka\n", expectedOutput: "Halo, Raka!" },
          { stdin: "GoLearner\n", expectedOutput: "Halo, GoLearner!" },
        ],
        explanation: "Input dapat dibaca dengan fmt.Scan dan output dibuat dengan fmt.Println.",
      },
    ],
  },
  {
    chapterSlug: "variabel-tipe",
    title: "Quiz: Variabel & Tipe Data",
    description: "Uji pemahamanmu tentang deklarasi, tipe dasar, dan konstanta.",
    questions: [
      {
        id: "variabel-tipe-1",
        type: "multiple_choice",
        prompt: "Apa arti utama dari istilah statically typed?",
        options: [
          { id: "a", label: "Tipe variabel diperiksa ketika kompilasi" },
          { id: "b", label: "Semua variabel harus bertipe string" },
          { id: "c", label: "Tipe hanya diketahui setelah program selesai" },
          { id: "d", label: "Program tidak memakai tipe data" },
        ],
        correctOptionId: "a",
        explanation: "Compiler Go memeriksa kecocokan tipe sebelum program dijalankan.",
      },
      {
        id: "variabel-tipe-2",
        type: "multiple_choice",
        prompt: "Apa yang dilakukan `:=` di dalam fungsi?",
        options: [
          { id: "a", label: "Membandingkan dua nilai" },
          { id: "b", label: "Membuat variabel baru dengan tipe yang disimpulkan" },
          { id: "c", label: "Membuat konstanta global" },
          { id: "d", label: "Menghapus variabel" },
        ],
        correctOptionId: "b",
        explanation: "Short declaration membuat variabel baru dan menyimpulkan tipenya dari nilai.",
      },
      {
        id: "variabel-tipe-3",
        type: "multiple_choice",
        prompt: "Manakah deklarasi konstanta yang valid?",
        options: [
          { id: "a", label: "const pi = 3.14" },
          { id: "b", label: "constant pi := 3.14" },
          { id: "c", label: "var const pi = 3.14" },
          { id: "d", label: "fixed pi = 3.14" },
        ],
        correctOptionId: "a",
        explanation: "Kata kunci const dipakai untuk nilai yang tidak diubah setelah deklarasi.",
      },
      {
        id: "variabel-tipe-4",
        type: "true_false",
        prompt: "Short declaration `:=` dapat dipakai di level package di luar fungsi.",
        correctAnswer: false,
        explanation: "Operator := hanya boleh digunakan di dalam body fungsi.",
      },
      {
        id: "variabel-tipe-5",
        type: "coding",
        prompt: "Gabungkan input nama dan umur dengan format output yang jelas.",
        instructions: "Baca nama dan umur dari stdin. Cetak dua baris: `Nama: <nama>` dan `Umur: <umur>`.",
        starterCode: code`package main

import "fmt"

func main() {
	var nama string
	var umur int
	fmt.Scan(&nama, &umur)
	// TODO: cetak nama dan umur
}
`,
        tests: [
          { stdin: "Budi 20\n", expectedOutput: "Nama: Budi\nUmur: 20" },
          { stdin: "Sari 17\n", expectedOutput: "Nama: Sari\nUmur: 17" },
          { stdin: "Doni 35\n", expectedOutput: "Nama: Doni\nUmur: 35" },
        ],
        explanation: "Go memiliki tipe eksplisit seperti string dan int, tetapi fmt.Scan dapat mengisi keduanya dari input.",
      },
    ],
  },
  {
    chapterSlug: "simbol-operator",
    title: "Quiz: Simbol & Operator",
    description: "Latihan membedakan deklarasi, assignment, perbandingan, dan logika.",
    questions: [
      {
        id: "simbol-operator-1",
        type: "multiple_choice",
        prompt: "Operator mana yang digunakan untuk membandingkan dua nilai?",
        options: [
          { id: "a", label: "=" },
          { id: "b", label: ":=" },
          { id: "c", label: "==" },
          { id: "d", label: "<-" },
        ],
        correctOptionId: "c",
        explanation: "== menghasilkan bool dari perbandingan kesamaan dua nilai.",
      },
      {
        id: "simbol-operator-2",
        type: "multiple_choice",
        prompt: "Berapa hasil `25 % 7`?",
        options: [
          { id: "a", label: "2" },
          { id: "b", label: "3" },
          { id: "c", label: "4" },
          { id: "d", label: "5" },
        ],
        correctOptionId: "c",
        explanation: "Operator modulo menghasilkan sisa pembagian; 25 dibagi 7 bersisa 4.",
      },
      {
        id: "simbol-operator-3",
        type: "multiple_choice",
        prompt: "Apa arti operator `&&`?",
        options: [
          { id: "a", label: "OR logika" },
          { id: "b", label: "AND logika" },
          { id: "c", label: "Alamat memori" },
          { id: "d", label: "Kirim ke channel" },
        ],
        correctOptionId: "b",
        explanation: "&& bernilai true jika kedua kondisi bernilai true.",
      },
      {
        id: "simbol-operator-4",
        type: "true_false",
        prompt: "Operator `=` digunakan untuk membandingkan dua nilai.",
        correctAnswer: false,
        explanation: "= melakukan assignment; perbandingan kesamaan memakai ==.",
      },
      {
        id: "simbol-operator-5",
        type: "coding",
        prompt: "Gunakan operator aritmatika untuk menghitung jumlah dan sisa bagi.",
        instructions: "Baca dua bilangan bulat a dan b. Cetak `Jumlah: a+b` dan `Sisa: a%b`.",
        starterCode: code`package main

import "fmt"

func main() {
	var a, b int
	fmt.Scan(&a, &b)
	// TODO: hitung jumlah dan sisa bagi
}
`,
        tests: [
          { stdin: "17 5\n", expectedOutput: "Jumlah: 22\nSisa: 2" },
          { stdin: "25 7\n", expectedOutput: "Jumlah: 32\nSisa: 4" },
          { stdin: "10 3\n", expectedOutput: "Jumlah: 13\nSisa: 1" },
        ],
        explanation: "Operator + menghitung jumlah, sedangkan % menghasilkan sisa pembagian.",
      },
    ],
  },
  {
    chapterSlug: "kontrol-alur",
    title: "Quiz: Kontrol Alur",
    description: "Uji pemahaman tentang if, switch, dan satu-satunya loop Go: for.",
    questions: [
      {
        id: "kontrol-alur-1",
        type: "multiple_choice",
        prompt: "Kata kunci apa yang dipakai untuk semua bentuk perulangan di Go?",
        options: [
          { id: "a", label: "loop" },
          { id: "b", label: "repeat" },
          { id: "c", label: "for" },
          { id: "d", label: "while" },
        ],
        correctOptionId: "c",
        explanation: "Go menggunakan for untuk loop bergaya counter, condition, maupun infinite loop.",
      },
      {
        id: "kontrol-alur-2",
        type: "multiple_choice",
        prompt: "Blok mana yang dipakai untuk memilih banyak kemungkinan berdasarkan satu nilai?",
        options: [
          { id: "a", label: "switch" },
          { id: "b", label: "choose" },
          { id: "c", label: "select-case" },
          { id: "d", label: "match" },
        ],
        correctOptionId: "a",
        explanation: "switch mengekspresikan pilihan berdasarkan nilai atau kondisi.",
      },
      {
        id: "kontrol-alur-3",
        type: "multiple_choice",
        prompt: "Apa fungsi `else` pada struktur if?",
        options: [
          { id: "a", label: "Menjalankan blok saat kondisi if false" },
          { id: "b", label: "Mengulang blok if" },
          { id: "c", label: "Mengakhiri program" },
          { id: "d", label: "Mengubah tipe kondisi" },
        ],
        correctOptionId: "a",
        explanation: "else menyediakan jalur alternatif ketika kondisi sebelumnya tidak terpenuhi.",
      },
      {
        id: "kontrol-alur-4",
        type: "true_false",
        prompt: "Go memiliki keyword `while` terpisah dari `for`.",
        correctAnswer: false,
        explanation: "Loop dengan kondisi saja ditulis menggunakan for tanpa bagian init dan post.",
      },
      {
        id: "kontrol-alur-5",
        type: "coding",
        prompt: "Gunakan perulangan untuk menghitung jumlah bilangan dari 1 sampai n.",
        instructions: "Baca n. Cetak `Total: ...` dengan jumlah 1 + 2 + ... + n.",
        starterCode: code`package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	total := 0
	// TODO: jumlahkan angka 1 sampai n
	fmt.Println("Total:", total)
}
`,
        tests: [
          { stdin: "1\n", expectedOutput: "Total: 1" },
          { stdin: "5\n", expectedOutput: "Total: 15" },
          { stdin: "10\n", expectedOutput: "Total: 55" },
        ],
        explanation: "for dapat dipakai untuk mengunjungi setiap angka dan mengakumulasikan total.",
      },
    ],
  },
  {
    chapterSlug: "fungsi",
    title: "Quiz: Fungsi",
    description: "Latihan parameter, nilai balik, dan pembagian tanggung jawab lewat fungsi.",
    questions: [
      {
        id: "fungsi-1",
        type: "multiple_choice",
        prompt: "Apa yang khas dari fungsi Go dibanding banyak bahasa lain?",
        options: [
          { id: "a", label: "Fungsi tidak boleh menerima parameter" },
          { id: "b", label: "Fungsi dapat mengembalikan lebih dari satu nilai" },
          { id: "c", label: "Fungsi harus selalu bernama main" },
          { id: "d", label: "Fungsi tidak dapat mengembalikan error" },
        ],
        correctOptionId: "b",
        explanation: "Multiple return values sering dipakai untuk mengembalikan hasil dan error sekaligus.",
      },
      {
        id: "fungsi-2",
        type: "multiple_choice",
        prompt: "Dalam `func tambah(a, b int) int`, apa arti `int` terakhir?",
        options: [
          { id: "a", label: "Tipe parameter a" },
          { id: "b", label: "Tipe parameter b" },
          { id: "c", label: "Tipe nilai balik fungsi" },
          { id: "d", label: "Nama fungsi" },
        ],
        correctOptionId: "c",
        explanation: "Tipe setelah kurung parameter adalah tipe nilai yang dikembalikan.",
      },
      {
        id: "fungsi-3",
        type: "multiple_choice",
        prompt: "Pola umum untuk menangani error di Go adalah...",
        options: [
          { id: "a", label: "Mengabaikan semua nilai balik" },
          { id: "b", label: "Memeriksa `err != nil` setelah pemanggilan" },
          { id: "c", label: "Menggunakan keyword catch" },
          { id: "d", label: "Menggunakan global exception handler" },
        ],
        correctOptionId: "b",
        explanation: "Go biasanya mengembalikan error sebagai nilai dan memeriksanya secara eksplisit.",
      },
      {
        id: "fungsi-4",
        type: "true_false",
        prompt: "Satu fungsi Go dapat mengembalikan dua atau lebih nilai.",
        correctAnswer: true,
        explanation: "Go mendukung multiple return values, misalnya `(hasil, err)`.",
      },
      {
        id: "fungsi-5",
        type: "coding",
        prompt: "Pisahkan operasi penjumlahan ke dalam fungsi.",
        instructions: "Buat fungsi `tambah(a, b int) int`, baca dua angka, lalu cetak `Hasil: ...`.",
        starterCode: code`package main

import "fmt"

func tambah(a, b int) int {
	// TODO: kembalikan jumlah a dan b
	return 0
}

func main() {
	var a, b int
	fmt.Scan(&a, &b)
	fmt.Println("Hasil:", tambah(a, b))
}
`,
        tests: [
          { stdin: "3 4\n", expectedOutput: "Hasil: 7" },
          { stdin: "-2 8\n", expectedOutput: "Hasil: 6" },
          { stdin: "100 25\n", expectedOutput: "Hasil: 125" },
        ],
        explanation: "Fungsi menerima input melalui parameter dan mengembalikan hasil lewat return.",
      },
    ],
  },
  {
    chapterSlug: "koleksi",
    title: "Quiz: Koleksi Data",
    description: "Uji pemahaman tentang array, slice, map, dan range.",
    questions: [
      {
        id: "koleksi-1",
        type: "multiple_choice",
        prompt: "Struktur data mana yang ukurannya dapat bertambah dengan append?",
        options: [
          { id: "a", label: "Array" },
          { id: "b", label: "Slice" },
          { id: "c", label: "Struct" },
          { id: "d", label: "Interface" },
        ],
        correctOptionId: "b",
        explanation: "Slice adalah view dinamis di atas array dan dapat diperbesar dengan append.",
      },
      {
        id: "koleksi-2",
        type: "multiple_choice",
        prompt: "Apa model data utama dari map Go?",
        options: [
          { id: "a", label: "Key-value" },
          { id: "b", label: "Hanya daftar berurutan" },
          { id: "c", label: "Pohon biner wajib" },
          { id: "d", label: "Kumpulan method" },
        ],
        correctOptionId: "a",
        explanation: "Map menyimpan nilai berdasarkan key, misalnya map[string]int.",
      },
      {
        id: "koleksi-3",
        type: "multiple_choice",
        prompt: "Keyword apa yang biasa dipakai untuk mengiterasi slice atau map?",
        options: [
          { id: "a", label: "range" },
          { id: "b", label: "iterate" },
          { id: "c", label: "each" },
          { id: "d", label: "yield" },
        ],
        correctOptionId: "a",
        explanation: "range menghasilkan index/value untuk slice atau key/value untuk map.",
      },
      {
        id: "koleksi-4",
        type: "true_false",
        prompt: "Urutan iterasi map Go selalu dijamin sama setiap kali program dijalankan.",
        correctAnswer: false,
        explanation: "Urutan map tidak dijamin; gunakan sort jika output perlu deterministik.",
      },
      {
        id: "koleksi-5",
        type: "coding",
        prompt: "Baca beberapa angka ke dalam slice dan hitung totalnya.",
        instructions: "Input berisi n lalu n angka. Cetak `Total: ...`.",
        starterCode: code`package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	angka := make([]int, n)
	for i := range angka {
		fmt.Scan(&angka[i])
	}
	total := 0
	// TODO: jumlahkan isi slice
	fmt.Println("Total:", total)
}
`,
        tests: [
          { stdin: "3 1 2 3\n", expectedOutput: "Total: 6" },
          { stdin: "4 10 -2 5 7\n", expectedOutput: "Total: 20" },
          { stdin: "1 42\n", expectedOutput: "Total: 42" },
        ],
        explanation: "Slice dapat diakses dengan index dan diiterasi menggunakan range.",
      },
    ],
  },
  {
    chapterSlug: "struct-method",
    title: "Quiz: Struct & Method",
    description: "Latihan menggabungkan data dengan struct dan perilaku dengan method.",
    questions: [
      {
        id: "struct-method-1",
        type: "multiple_choice",
        prompt: "Apa kegunaan utama struct?",
        options: [
          { id: "a", label: "Mengelompokkan field yang saling terkait" },
          { id: "b", label: "Mengulang kode tanpa kondisi" },
          { id: "c", label: "Membuat package baru otomatis" },
          { id: "d", label: "Menghapus tipe data" },
        ],
        correctOptionId: "a",
        explanation: "Struct mendefinisikan tipe dengan kumpulan field yang berhubungan.",
      },
      {
        id: "struct-method-2",
        type: "multiple_choice",
        prompt: "Apa yang membedakan method dari fungsi biasa?",
        options: [
          { id: "a", label: "Method memiliki receiver" },
          { id: "b", label: "Method tidak boleh memiliki parameter" },
          { id: "c", label: "Method selalu mengembalikan string" },
          { id: "d", label: "Method hanya dapat dipanggil dari main" },
        ],
        correctOptionId: "a",
        explanation: "Receiver mengikat method pada sebuah tipe, misalnya `func (p Persegi) Luas()`.",
      },
      {
        id: "struct-method-3",
        type: "multiple_choice",
        prompt: "Bagaimana mengakses field `Nama` dari variabel `s` bertipe struct?",
        options: [
          { id: "a", label: "s->Nama" },
          { id: "b", label: "s.Nama" },
          { id: "c", label: "s::Nama" },
          { id: "d", label: "Nama.s" },
        ],
        correctOptionId: "b",
        explanation: "Operator titik dipakai untuk mengakses field dan method struct.",
      },
      {
        id: "struct-method-4",
        type: "true_false",
        prompt: "Method Go harus selalu dideklarasikan di dalam definisi struct.",
        correctAnswer: false,
        explanation: "Method dideklarasikan di luar struct dengan receiver yang menunjuk tipe terkait.",
      },
      {
        id: "struct-method-5",
        type: "coding",
        prompt: "Buat struct persegi yang dapat menghitung luasnya lewat method.",
        instructions: "Baca sisi, buat `Persegi`, lalu cetak `Luas: ...` dengan dua angka desimal.",
        starterCode: code`package main

import "fmt"

type Persegi struct {
	Sisi float64
}

func (p Persegi) Luas() float64 {
	// TODO: kembalikan luas persegi
	return 0
}

func main() {
	var sisi float64
	fmt.Scan(&sisi)
	p := Persegi{Sisi: sisi}
	fmt.Printf("Luas: %.2f\n", p.Luas())
}
`,
        tests: [
          { stdin: "4\n", expectedOutput: "Luas: 16.00" },
          { stdin: "2.5\n", expectedOutput: "Luas: 6.25" },
          { stdin: "0\n", expectedOutput: "Luas: 0.00" },
        ],
        explanation: "Method dengan value receiver dapat membaca field struct untuk menghitung luas.",
      },
    ],
  },
  {
    chapterSlug: "pointer",
    title: "Quiz: Pointer",
    description: "Pahami alamat memori, dereference, dan perubahan nilai melalui pointer.",
    questions: [
      {
        id: "pointer-1",
        type: "multiple_choice",
        prompt: "Apa yang dikembalikan operator `&x`?",
        options: [
          { id: "a", label: "Nilai salinan x" },
          { id: "b", label: "Alamat memori x" },
          { id: "c", label: "Tipe x" },
          { id: "d", label: "Ukuran x" },
        ],
        correctOptionId: "b",
        explanation: "& mengambil alamat dari sebuah variabel.",
      },
      {
        id: "pointer-2",
        type: "multiple_choice",
        prompt: "Apa arti `*p` ketika p adalah pointer?",
        options: [
          { id: "a", label: "Mengambil nilai pada alamat yang ditunjuk p" },
          { id: "b", label: "Membuat pointer baru secara otomatis" },
          { id: "c", label: "Menghapus nilai p" },
          { id: "d", label: "Membandingkan p dengan nol" },
        ],
        correctOptionId: "a",
        explanation: "Dereference * mengakses nilai yang berada pada alamat pointer.",
      },
      {
        id: "pointer-3",
        type: "multiple_choice",
        prompt: "Mengapa fungsi menerima `*int` jika ingin mengubah int milik pemanggil?",
        options: [
          { id: "a", label: "Agar fungsi menerima alamat nilai asli" },
          { id: "b", label: "Agar int berubah menjadi string" },
          { id: "c", label: "Agar fungsi tidak dapat mengakses nilai" },
          { id: "d", label: "Agar compiler melewati semua pemeriksaan" },
        ],
        correctOptionId: "a",
        explanation: "Pointer membawa alamat nilai asli sehingga dereference dapat mengubahnya.",
      },
      {
        id: "pointer-4",
        type: "true_false",
        prompt: "Memanggil `gandakan(&x)` memungkinkan fungsi mengubah nilai x melalui pointer.",
        correctAnswer: true,
        explanation: "Fungsi menerima alamat x lalu dapat mengubah nilai di alamat tersebut.",
      },
      {
        id: "pointer-5",
        type: "coding",
        prompt: "Ubah nilai asli melalui pointer.",
        instructions: "Baca integer x, buat fungsi `gandakan(n *int)`, lalu cetak `Hasil: ...` setelah x dikali dua.",
        starterCode: code`package main

import "fmt"

func gandakan(n *int) {
	// TODO: kalikan nilai yang ditunjuk n dengan 2
}

func main() {
	var x int
	fmt.Scan(&x)
	gandakan(&x)
	fmt.Println("Hasil:", x)
}
`,
        tests: [
          { stdin: "5\n", expectedOutput: "Hasil: 10" },
          { stdin: "-3\n", expectedOutput: "Hasil: -6" },
          { stdin: "0\n", expectedOutput: "Hasil: 0" },
        ],
        explanation: "&x mengirim alamat x dan *n mengubah nilai yang ada di alamat tersebut.",
      },
    ],
  },
  {
    chapterSlug: "interface",
    title: "Quiz: Interface",
    description: "Latihan kontrak perilaku dan implementasi interface secara implisit.",
    questions: [
      {
        id: "interface-1",
        type: "multiple_choice",
        prompt: "Bagaimana sebuah tipe memenuhi interface Go?",
        options: [
          { id: "a", label: "Dengan keyword implements" },
          { id: "b", label: "Dengan memiliki semua method yang diminta" },
          { id: "c", label: "Dengan meng-extend class interface" },
          { id: "d", label: "Dengan mendaftarkan tipe di runtime" },
        ],
        correctOptionId: "b",
        explanation: "Implementasi interface Go bersifat implisit berdasarkan method set.",
      },
      {
        id: "interface-2",
        type: "multiple_choice",
        prompt: "Apa isi interface `Bentuk { Luas() float64 }`?",
        options: [
          { id: "a", label: "Satu field bernama Luas" },
          { id: "b", label: "Kontrak method Luas yang mengembalikan float64" },
          { id: "c", label: "Satu instance Lingkaran" },
          { id: "d", label: "Kode untuk menghitung semua bentuk" },
        ],
        correctOptionId: "b",
        explanation: "Interface mendeskripsikan method yang harus tersedia, bukan implementasinya.",
      },
      {
        id: "interface-3",
        type: "multiple_choice",
        prompt: "Apa manfaat utama memakai interface?",
        options: [
          { id: "a", label: "Memungkinkan kode memakai beberapa tipe lewat perilaku yang sama" },
          { id: "b", label: "Menghilangkan semua tipe statis" },
          { id: "c", label: "Membuat program selalu lebih cepat" },
          { id: "d", label: "Menghindari kebutuhan membuat method" },
        ],
        correctOptionId: "a",
        explanation: "Interface memungkinkan fungsi bergantung pada perilaku, bukan tipe konkret.",
      },
      {
        id: "interface-4",
        type: "true_false",
        prompt: "Go membutuhkan keyword `implements` agar struct memenuhi interface.",
        correctAnswer: false,
        explanation: "Go menentukan pemenuhan interface secara implisit dari method yang dimiliki tipe.",
      },
      {
        id: "interface-5",
        type: "coding",
        prompt: "Gunakan interface untuk menghitung luas lingkaran.",
        instructions: "Baca jari-jari, buat `Lingkaran` yang memenuhi `Bentuk`, lalu cetak `Luas: ...` dengan dua desimal. Gunakan pi 3.14.",
        starterCode: code`package main

import "fmt"

type Bentuk interface {
	Luas() float64
}

type Lingkaran struct {
	Jari float64
}

func (l Lingkaran) Luas() float64 {
	// TODO: hitung luas lingkaran dengan pi 3.14
	return 0
}

func main() {
	var jari float64
	fmt.Scan(&jari)
	var b Bentuk = Lingkaran{Jari: jari}
	fmt.Printf("Luas: %.2f\n", b.Luas())
}
`,
        tests: [
          { stdin: "2\n", expectedOutput: "Luas: 12.56" },
          { stdin: "3\n", expectedOutput: "Luas: 28.26" },
          { stdin: "0\n", expectedOutput: "Luas: 0.00" },
        ],
        explanation: "Lingkaran dapat dipakai sebagai Bentuk karena memiliki method Luas dengan signature yang sesuai.",
      },
    ],
  },
  {
    chapterSlug: "konkurensi",
    title: "Quiz: Konkurensi",
    description: "Uji pemahaman tentang goroutine, channel, dan WaitGroup.",
    questions: [
      {
        id: "konkurensi-1",
        type: "multiple_choice",
        prompt: "Bagaimana menjalankan fungsi secara concurrent sebagai goroutine?",
        options: [
          { id: "a", label: "Menambahkan keyword go sebelum pemanggilan" },
          { id: "b", label: "Menambahkan keyword async setelah fungsi" },
          { id: "c", label: "Membuat package parallel" },
          { id: "d", label: "Menggunakan for tanpa kondisi" },
        ],
        correctOptionId: "a",
        explanation: "Keyword go memulai pemanggilan fungsi sebagai goroutine.",
      },
      {
        id: "konkurensi-2",
        type: "multiple_choice",
        prompt: "Untuk apa channel biasanya digunakan?",
        options: [
          { id: "a", label: "Komunikasi dan pertukaran nilai antar goroutine" },
          { id: "b", label: "Mendeklarasikan konstanta" },
          { id: "c", label: "Mengganti semua struct" },
          { id: "d", label: "Mengaktifkan compiler" },
        ],
        correctOptionId: "a",
        explanation: "Channel memberi jalur typed untuk mengirim dan menerima nilai antar goroutine.",
      },
      {
        id: "konkurensi-3",
        type: "multiple_choice",
        prompt: "Apa fungsi utama `sync.WaitGroup`?",
        options: [
          { id: "a", label: "Menunggu sekumpulan goroutine selesai" },
          { id: "b", label: "Mengurutkan map" },
          { id: "c", label: "Menyimpan hasil ke file" },
          { id: "d", label: "Membuat channel buffered otomatis" },
        ],
        correctOptionId: "a",
        explanation: "WaitGroup menghitung pekerjaan dan membuat goroutine utama menunggu sampai selesai.",
      },
      {
        id: "konkurensi-4",
        type: "true_false",
        prompt: "Menambahkan keyword `go` otomatis menjamin urutan output goroutine.",
        correctAnswer: false,
        explanation: "Scheduler dapat menjalankan goroutine dalam urutan berbeda; gunakan sinkronisasi jika urutan penting.",
      },
      {
        id: "konkurensi-5",
        type: "coding",
        prompt: "Jumlahkan kuadrat angka 0 sampai n-1 menggunakan goroutine dan channel.",
        instructions: "Baca n. Jalankan satu goroutine per angka, kirim kuadratnya ke channel, lalu cetak `Total: ...`.",
        starterCode: code`package main

import (
	"fmt"
	"sync"
)

func main() {
	var n int
	fmt.Scan(&n)
	ch := make(chan int, n)
	var wg sync.WaitGroup
	_ = ch
	_ = wg
	for i := 0; i < n; i++ {
		// TODO: jalankan goroutine yang mengirim i*i
	}
	// TODO: tunggu goroutine, tutup channel, lalu jumlahkan
	fmt.Println("Total:", 0)
}
`,
        tests: [
          { stdin: "1\n", expectedOutput: "Total: 0" },
          { stdin: "3\n", expectedOutput: "Total: 5" },
          { stdin: "5\n", expectedOutput: "Total: 30" },
        ],
        explanation: "WaitGroup menunggu producer selesai, sedangkan channel mengirim hasil ke goroutine utama.",
      },
    ],
  },
  {
    chapterSlug: "capstone",
    title: "Quiz: Capstone",
    description: "Gabungkan struct, slice, method, dan loop dalam satu latihan.",
    questions: [
      {
        id: "capstone-1",
        type: "multiple_choice",
        prompt: "Konsep mana yang paling tepat untuk menyimpan nama dan daftar nilai siswa?",
        options: [
          { id: "a", label: "Struct dengan field Nama dan Nilai []int" },
          { id: "b", label: "Satu konstanta string" },
          { id: "c", label: "Satu channel tanpa buffer" },
          { id: "d", label: "Satu interface kosong saja" },
        ],
        correctOptionId: "a",
        explanation: "Struct mengelompokkan identitas siswa dan slice nilai dalam satu tipe.",
      },
      {
        id: "capstone-2",
        type: "multiple_choice",
        prompt: "Mengapa method `RataRata` perlu melakukan loop pada `s.Nilai`?",
        options: [
          { id: "a", label: "Untuk menjumlahkan semua nilai sebelum dibagi jumlah data" },
          { id: "b", label: "Untuk mengubah semua nilai menjadi string" },
          { id: "c", label: "Untuk membuat package baru" },
          { id: "d", label: "Untuk menghapus slice" },
        ],
        correctOptionId: "a",
        explanation: "Rata-rata dihitung dari total nilai dibagi banyaknya nilai.",
      },
      {
        id: "capstone-3",
        type: "multiple_choice",
        prompt: "Apa keuntungan memecah program capstone ke dalam method?",
        options: [
          { id: "a", label: "Logika terkait tipe dapat dipakai ulang dan lebih mudah dibaca" },
          { id: "b", label: "Compiler tidak perlu memeriksa tipe" },
          { id: "c", label: "Program tidak perlu fungsi main" },
          { id: "d", label: "Semua loop menjadi otomatis concurrent" },
        ],
        correctOptionId: "a",
        explanation: "Method mengikat perilaku ke data yang relevan dan menjaga main tetap ringkas.",
      },
      {
        id: "capstone-4",
        type: "true_false",
        prompt: "Sebuah method dapat membaca field dari receiver struct-nya.",
        correctAnswer: true,
        explanation: "Receiver memberi method akses ke field dan perilaku tipe terkait.",
      },
      {
        id: "capstone-5",
        type: "coding",
        prompt: "Hitung rata-rata tiga nilai menggunakan struct dan method.",
        instructions: "Baca tiga nilai integer. Gunakan `Siswa` dengan method `RataRata`, lalu cetak `Rata-rata: ...` dengan dua desimal.",
        starterCode: code`package main

import "fmt"

type Siswa struct {
	Nilai []int
}

func (s Siswa) RataRata() float64 {
	// TODO: hitung rata-rata nilai
	return 0
}

func main() {
	nilai := make([]int, 3)
	for i := range nilai {
		fmt.Scan(&nilai[i])
	}
	s := Siswa{Nilai: nilai}
	fmt.Printf("Rata-rata: %.2f\n", s.RataRata())
}
`,
        tests: [
          { stdin: "80 90 100\n", expectedOutput: "Rata-rata: 90.00" },
          { stdin: "70 75 80\n", expectedOutput: "Rata-rata: 75.00" },
          { stdin: "1 2 4\n", expectedOutput: "Rata-rata: 2.33" },
        ],
        explanation: "Method mengiterasi slice nilai, menghitung total, lalu membaginya dengan panjang slice.",
      },
    ],
  },
  {
    chapterSlug: "ebpf-pengantar",
    title: "Quiz: Pengantar eBPF",
    description: "Pahami hook, verifier, dan simulasi program eBPF di Go.",
    questions: [
      {
        id: "ebpf-pengantar-1",
        type: "multiple_choice",
        prompt: "Apa tugas verifier sebelum program eBPF dimuat?",
        options: [
          { id: "a", label: "Memastikan program aman dan memenuhi batasan kernel" },
          { id: "b", label: "Mengubah Go menjadi JavaScript" },
          { id: "c", label: "Mengunduh library dari internet" },
          { id: "d", label: "Menjalankan program sebagai root tanpa pemeriksaan" },
        ],
        correctOptionId: "a",
        explanation: "Verifier menganalisis keamanan akses memori, loop, dan perilaku program eBPF.",
      },
      {
        id: "ebpf-pengantar-2",
        type: "multiple_choice",
        prompt: "Apa contoh hook eBPF untuk event fungsi kernel?",
        options: [
          { id: "a", label: "kprobe atau tracepoint" },
          { id: "b", label: "fmt.Println" },
          { id: "c", label: "goroutine" },
          { id: "d", label: "package main" },
        ],
        correctOptionId: "a",
        explanation: "kprobe dan tracepoint dapat memicu program eBPF saat event kernel terjadi.",
      },
      {
        id: "ebpf-pengantar-3",
        type: "multiple_choice",
        prompt: "Mengapa contoh eBPF pada panel GoLearn disimulasikan?",
        options: [
          { id: "a", label: "eBPF asli membutuhkan kernel Linux dan privilege tertentu" },
          { id: "b", label: "Go tidak dapat membuat program biasa" },
          { id: "c", label: "eBPF hanya berisi HTML" },
          { id: "d", label: "Simulator selalu lebih cepat dari kernel" },
        ],
        correctOptionId: "a",
        explanation: "Runner bersifat unprivileged dan stdlib-only, jadi contoh panel meniru alur datanya.",
      },
      {
        id: "ebpf-pengantar-4",
        type: "true_false",
        prompt: "Program eBPF asli dapat selalu dijalankan di runner GoLearn tanpa akses kernel atau privilege.",
        correctAnswer: false,
        explanation: "Runner tidak memberikan akses kernel/privilege; yang tersedia adalah simulasi aman.",
      },
      {
        id: "ebpf-pengantar-5",
        type: "coding",
        prompt: "Simulasikan penghitung paket berdasarkan protokol.",
        instructions: "Input berisi n lalu n nama protokol. Cetak jumlah `icmp`, `tcp`, dan `udp` dalam tiga baris tersebut.",
        starterCode: code`package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	counter := map[string]int{}
	for i := 0; i < n; i++ {
		var proto string
		fmt.Scan(&proto)
		// TODO: hitung paket tiap protokol
	}
	fmt.Println("icmp:", counter["icmp"])
	fmt.Println("tcp:", counter["tcp"])
	fmt.Println("udp:", counter["udp"])
}
`,
        tests: [
          { stdin: "3 tcp udp tcp\n", expectedOutput: "icmp: 0\ntcp: 2\nudp: 1" },
          { stdin: "6 tcp udp tcp tcp udp icmp\n", expectedOutput: "icmp: 1\ntcp: 3\nudp: 2" },
          { stdin: "2 icmp icmp\n", expectedOutput: "icmp: 2\ntcp: 0\nudp: 0" },
        ],
        explanation: "Map dapat menyimpan counter event dan key yang tidak ada menghasilkan nilai int nol.",
      },
    ],
  },
  {
    chapterSlug: "ebpf-maps",
    title: "Quiz: BPF Maps",
    description: "Latihan agregasi event dan pertukaran data melalui map.",
    questions: [
      {
        id: "ebpf-maps-1",
        type: "multiple_choice",
        prompt: "Apa peran BPF map dalam arsitektur eBPF?",
        options: [
          { id: "a", label: "Berbagi data antara program kernel dan user space" },
          { id: "b", label: "Menggantikan compiler Go" },
          { id: "c", label: "Menyimpan password aplikasi" },
          { id: "d", label: "Membuat koneksi internet otomatis" },
        ],
        correctOptionId: "a",
        explanation: "BPF map adalah jembatan data key-value antara sisi kernel dan user space.",
      },
      {
        id: "ebpf-maps-2",
        type: "multiple_choice",
        prompt: "Map jenis hash paling mirip dengan struktur data apa di Go?",
        options: [
          { id: "a", label: "map[key]value" },
          { id: "b", label: "chan value" },
          { id: "c", label: "[]byte saja" },
          { id: "d", label: "interface tanpa method" },
        ],
        correctOptionId: "a",
        explanation: "Hash map menyimpan pasangan key-value seperti map Go.",
      },
      {
        id: "ebpf-maps-3",
        type: "multiple_choice",
        prompt: "Mengapa contoh BPF map perlu mengurutkan PID sebelum mencetak?",
        options: [
          { id: "a", label: "Urutan iterasi map tidak dijamin" },
          { id: "b", label: "PID hanya bisa dibaca setelah sort" },
          { id: "c", label: "sort mengaktifkan map" },
          { id: "d", label: "Tanpa sort Go tidak bisa compile" },
        ],
        correctOptionId: "a",
        explanation: "Pengurutan membuat output map deterministik dan mudah diuji.",
      },
      {
        id: "ebpf-maps-4",
        type: "true_false",
        prompt: "BPF map hanya dapat dibaca oleh program yang berjalan di kernel.",
        correctAnswer: false,
        explanation: "Salah satu kegunaan map adalah memungkinkan user space membaca data dari program kernel.",
      },
      {
        id: "ebpf-maps-5",
        type: "coding",
        prompt: "Agregasikan jumlah event per PID lalu cetak terurut.",
        instructions: "Input berisi n lalu n PID integer. Cetak `PID <pid>: <jumlah>` untuk tiap PID dari kecil ke besar.",
        starterCode: code`package main

import (
	"fmt"
	"sort"
)

func main() {
	var n int
	fmt.Scan(&n)
	counter := map[int]int{}
	for i := 0; i < n; i++ {
		var pid int
		fmt.Scan(&pid)
		// TODO: naikkan counter PID
	}

	pids := make([]int, 0, len(counter))
	for pid := range counter {
		pids = append(pids, pid)
	}
	sort.Ints(pids)
	for _, pid := range pids {
		fmt.Printf("PID %d: %d\n", pid, counter[pid])
	}
}
`,
        tests: [
          { stdin: "6 1001 1001 1002 1001 1002 1002\n", expectedOutput: "PID 1001: 3\nPID 1002: 3" },
          { stdin: "4 7 3 7 7\n", expectedOutput: "PID 3: 1\nPID 7: 3" },
          { stdin: "3 42 10 42\n", expectedOutput: "PID 10: 1\nPID 42: 2" },
        ],
        explanation: "Map mengagregasi counter; key dikumpulkan dan diurutkan agar output stabil.",
      },
    ],
  },
  {
    chapterSlug: "ebpf-go",
    title: "Quiz: eBPF dari Go",
    description: "Uji pemahaman alur bpf2go, load, attach, dan pembacaan event.",
    questions: [
      {
        id: "ebpf-go-1",
        type: "multiple_choice",
        prompt: "Library Go yang populer untuk berinteraksi dengan eBPF adalah...",
        options: [
          { id: "a", label: "github.com/cilium/ebpf" },
          { id: "b", label: "github.com/go/kernel-vm" },
          { id: "c", label: "std/ebpf-only" },
          { id: "d", label: "github.com/golang/browser" },
        ],
        correctOptionId: "a",
        explanation: "cilium/ebpf menyediakan API Go untuk load object, attach link, dan map.",
      },
      {
        id: "ebpf-go-2",
        type: "multiple_choice",
        prompt: "Apa yang dihasilkan oleh alur bpf2go?",
        options: [
          { id: "a", label: "Object eBPF dan wrapper Go untuk memuatnya" },
          { id: "b", label: "Database PostgreSQL otomatis" },
          { id: "c", label: "Binary JavaScript untuk browser" },
          { id: "d", label: "Password root kernel" },
        ],
        correctOptionId: "a",
        explanation: "bpf2go menggabungkan compile program eBPF dengan kode Go pembungkus.",
      },
      {
        id: "ebpf-go-3",
        type: "multiple_choice",
        prompt: "Setelah program eBPF di-load, langkah penting berikutnya biasanya adalah...",
        options: [
          { id: "a", label: "Attach ke hook yang sesuai" },
          { id: "b", label: "Menghapus semua map" },
          { id: "c", label: "Mengubahnya menjadi HTML" },
          { id: "d", label: "Menjalankan `go get` saat runtime runner" },
        ],
        correctOptionId: "a",
        explanation: "Program perlu dipasang ke hook seperti XDP, kprobe, atau tracepoint agar menerima event.",
      },
      {
        id: "ebpf-go-4",
        type: "true_false",
        prompt: "Contoh cilium/ebpf yang membutuhkan kernel dan privilege dapat dijalankan langsung di panel stdlib-only.",
        correctAnswer: false,
        explanation: "Panel menggunakan simulasi aman tanpa dependency eksternal, root, atau akses kernel.",
      },
      {
        id: "ebpf-go-5",
        type: "coding",
        prompt: "Agregasikan byte traffic per alamat IP seperti data dari ring buffer.",
        instructions: "Input berisi n lalu n pasangan `<ip> <bytes>`. Cetak `ip -> bytes` dari traffic terbesar; jika sama, urutkan IP secara ascending.",
        starterCode: code`package main

import (
	"fmt"
	"sort"
)

type Row struct {
	IP    string
	Bytes int
}

func main() {
	var n int
	fmt.Scan(&n)
	traffic := map[string]int{}
	for i := 0; i < n; i++ {
		var ip string
		var bytes int
		fmt.Scan(&ip, &bytes)
		// TODO: agregasikan bytes per IP
	}

	rows := make([]Row, 0, len(traffic))
	for ip, bytes := range traffic {
		rows = append(rows, Row{IP: ip, Bytes: bytes})
	}
	sort.Slice(rows, func(i, j int) bool {
		if rows[i].Bytes == rows[j].Bytes {
			return rows[i].IP < rows[j].IP
		}
		return rows[i].Bytes > rows[j].Bytes
	})
	for _, row := range rows {
		fmt.Printf("%s -> %d\n", row.IP, row.Bytes)
	}
}
`,
        tests: [
          { stdin: "5 10.0.0.1 500 10.0.0.2 200 10.0.0.1 300 10.0.0.3 100 10.0.0.2 400\n", expectedOutput: "10.0.0.1 -> 800\n10.0.0.2 -> 600\n10.0.0.3 -> 100" },
          { stdin: "4 10.0.0.2 100 10.0.0.1 100 10.0.0.2 50 10.0.0.3 200\n", expectedOutput: "10.0.0.3 -> 200\n10.0.0.2 -> 150\n10.0.0.1 -> 100" },
          { stdin: "2 192.168.1.1 0 10.0.0.1 0\n", expectedOutput: "10.0.0.1 -> 0\n192.168.1.1 -> 0" },
        ],
        explanation: "User space biasanya membaca event, mengagregasikannya, lalu mengurutkan hasil agar mudah dibaca.",
      },
    ],
  },
];

export const miniProject: MiniProjectQuiz = {
  slug: "mini-project",
  kind: "mini_project",
  title: "Mini Project: Todo CLI",
  description:
    "Bangun aplikasi todo berbasis terminal dengan workspace multi-file dan hidden tests.",
  instructions: `
Buat aplikasi Todo CLI yang membaca perintah dari stdin, satu perintah per baris.

- ADD <judul> menambahkan task baru dengan ID berurutan mulai dari 1.
- DONE <id> menandai task dengan ID tersebut sebagai selesai. ID yang tidak ada diabaikan.
- LIST mencetak semua task sesuai urutan dibuat dengan format 1. [ ] Judul atau 1. [x] Judul.
- SUMMARY mencetak jumlah total, selesai, dan masih terbuka:

  Total: 2
  Selesai: 1
  Terbuka: 1

Lengkapi logika pada todo.go dan format.go. Semua file berada dalam package main
dan dijalankan bersama sebagai satu program.
`.trim(),
  sampleInput: `ADD Belajar struct
ADD Latihan method
DONE 1
LIST
SUMMARY
`,
  files: [
    {
      name: "main.go",
      starterCode: code`package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	tasks := []Task{}

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		fields := strings.Fields(line)
		command := strings.ToUpper(fields[0])
		switch command {
		case "ADD":
			title := strings.TrimSpace(strings.TrimPrefix(line, fields[0]))
			tasks = addTask(tasks, title)
		case "DONE":
			if len(fields) != 2 {
				continue
			}
			id, err := strconv.Atoi(fields[1])
			if err != nil {
				continue
			}
			tasks = completeTask(tasks, id)
		case "LIST":
			for _, task := range tasks {
				fmt.Println(formatTask(task))
			}
		case "SUMMARY":
			fmt.Println(formatSummary(tasks))
		}
	}
}
`,
    },
    {
      name: "todo.go",
      starterCode: code`package main

type Task struct {
	ID    int
	Title string
	Done  bool
}

func addTask(tasks []Task, title string) []Task {
	// TODO: tambahkan task baru dengan ID berurutan.
	return tasks
}

func completeTask(tasks []Task, id int) []Task {
	// TODO: tandai task dengan ID yang sesuai sebagai selesai.
	return tasks
}
`,
    },
    {
      name: "format.go",
      starterCode: code`package main

import "fmt"

func formatTask(task Task) string {
	// TODO: gunakan [ ] untuk task terbuka dan [x] untuk task selesai.
	return fmt.Sprintf("%d. [ ] %s", task.ID, task.Title)
}

func formatSummary(tasks []Task) string {
	// TODO: hitung jumlah task selesai dan yang masih terbuka.
	return fmt.Sprintf("Total: %d\nSelesai: %d\nTerbuka: %d", len(tasks), 0, len(tasks))
}
`,
    },
  ],
  tests: [
    {
      stdin: "ADD Belajar Go\nADD Membuat program\nLIST\n",
      expectedOutput: "1. [ ] Belajar Go\n2. [ ] Membuat program",
    },
    {
      stdin: "ADD Belajar Go\nDONE 1\nLIST\n",
      expectedOutput: "1. [x] Belajar Go",
    },
    {
      stdin: "ADD Satu\nADD Dua\nDONE 2\nSUMMARY\n",
      expectedOutput: "Total: 2\nSelesai: 1\nTerbuka: 1",
    },
    {
      stdin: "SUMMARY\n",
      expectedOutput: "Total: 0\nSelesai: 0\nTerbuka: 0",
    },
    {
      stdin: "ADD A\nADD B\nDONE 1\nDONE 99\nLIST\nSUMMARY\n",
      expectedOutput: "1. [x] A\n2. [ ] B\nTotal: 2\nSelesai: 1\nTerbuka: 1",
    },
  ],
};

export const allQuizzes: QuizDefinition[] = [...quizzes, miniProject];

export function isMiniProjectQuiz(
  quiz: QuizDefinition,
): quiz is MiniProjectQuiz {
  return "kind" in quiz && quiz.kind === "mini_project";
}

export function getQuiz(slug: string): QuizDefinition | undefined {
  return allQuizzes.find((quiz) =>
    isMiniProjectQuiz(quiz) ? quiz.slug === slug : quiz.chapterSlug === slug,
  );
}

export function toPublicQuiz(quiz: ChapterQuiz): PublicChapterQuiz {
  return {
    chapterSlug: quiz.chapterSlug,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map((question) => {
      if (question.type === "multiple_choice") {
        return {
          id: question.id,
          type: question.type,
          prompt: question.prompt,
          options: question.options,
        };
      }
      if (question.type === "true_false") {
        return {
          id: question.id,
          type: question.type,
          prompt: question.prompt,
        };
      }
      return {
        id: question.id,
        type: question.type,
          prompt: question.prompt,
          instructions: question.instructions,
          starterCode: question.starterCode,
        };
    }),
  };
}

export function toPublicMiniProject(
  quiz: MiniProjectQuiz,
): PublicMiniProject {
  return {
    slug: quiz.slug,
    kind: quiz.kind,
    title: quiz.title,
    description: quiz.description,
    instructions: quiz.instructions,
    sampleInput: quiz.sampleInput,
    files: quiz.files.map((file) => ({
      name: file.name,
      content: file.starterCode,
    })),
  };
}

export function isValidQuiz(quiz: ChapterQuiz): boolean {
  if (quiz.questions.length !== 5) return false;
  const ids = new Set(quiz.questions.map((question) => question.id));
  if (ids.size !== quiz.questions.length) return false;

  const multipleChoiceCount = quiz.questions.filter(
    (question) => question.type === "multiple_choice",
  ).length;
  const trueFalseCount = quiz.questions.filter(
    (question) => question.type === "true_false",
  ).length;
  const codingQuestions = quiz.questions.filter(
    (question): question is CodingQuestion => question.type === "coding",
  );

  return (
    multipleChoiceCount === 3 &&
    trueFalseCount === 1 &&
    codingQuestions.length === 1 &&
    codingQuestions[0].tests.length === 3
  );
}

export function isValidMiniProject(quiz: MiniProjectQuiz): boolean {
  const names = quiz.files.map((file) => file.name);
  const uniqueNames = new Set(names);
  return (
    quiz.slug === "mini-project" &&
    names.length === 3 &&
    uniqueNames.size === names.length &&
    names.every((name) => name.endsWith(".go")) &&
    quiz.files.every((file) => file.starterCode.trim().length > 0) &&
    quiz.tests.length === 5 &&
    quiz.tests.every((test) => test.expectedOutput.trim().length > 0)
  );
}
