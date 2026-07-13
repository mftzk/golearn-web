import type { MiniProjectQuiz } from "@/content/quizzes";

const code = String.raw;

export const pilotMiniProjects: MiniProjectQuiz[] = [
  {
    slug: "mini-project-fungsi",
    kind: "mini_project",
    chapterSlug: "fungsi",
    title: "Mini Project: Command Calculator",
    description:
      "Bangun kalkulator command line yang memisahkan operasi ke dalam function dan menangani error pembagian.",
    instructions: `
Buat kalkulator yang membaca satu command per baris dari stdin.

- ADD <a> <b> mencetak ADD = <hasil>.
- SUB <a> <b> mencetak SUB = <hasil>.
- MUL <a> <b> mencetak MUL = <hasil>.
- DIV <a> <b> mencetak DIV = <hasil> menggunakan pembagian integer.
- DIV dengan pembagi 0 mencetak Error: pembagi nol.
- Command yang tidak valid diabaikan.

Pisahkan operasi, formatting, dan alur pembacaan input ke file yang sesuai.
Starter code hanya berisi komentar panduan; tulis seluruh kode sendiri.
`.trim(),
    sampleInput: `ADD 12 5
SUB 12 5
MUL 4 3
DIV 10 2
`,
    files: [
      {
        name: "main.go",
        starterCode: code`package main

// TODO: Import bufio, fmt, os, strconv, dan strings.

func main() {
	// TODO: Buat scanner untuk membaca stdin per baris.
	// TODO: Pecah setiap baris menjadi command dan dua angka.
	// TODO: Ubah argumen angka dari string menjadi int.
	// TODO: Panggil function operasi sesuai command ADD, SUB, MUL, atau DIV.
	// TODO: Cetak hasil normal dan error dengan function dari format.go.
	// TODO: Abaikan baris kosong, command tidak dikenal, dan input yang tidak valid.
}
`,
        clues: [
          "1. Gunakan bufio.NewScanner(os.Stdin) dan strings.Fields untuk membaca command.",
          "2. Setiap command valid memiliki tiga field: nama operasi, a, dan b. Parse a serta b dengan strconv.Atoi.",
          "3. Buat switch berdasarkan strings.ToUpper(fields[0]). ADD, SUB, dan MUL cukup mencetak hasil function integer.",
          "4. Untuk DIV, terima dua hasil balik dari divide: nilai dan error. Jika error tidak nil, cetak formatError.",
          "5. Baris dengan jumlah field bukan tiga atau angka yang gagal diparse harus dilewati.",
        ],
      },
      {
        name: "operations.go",
        starterCode: code`package main

// TODO: Import errors jika diperlukan untuk membuat error pembagian nol.

// TODO: Buat function add(a, b int) int.
// TODO: Buat function subtract(a, b int) int.
// TODO: Buat function multiply(a, b int) int.
// TODO: Buat function divide(a, b int) (int, error).
`,
        clues: [
          "1. Buat empat function dengan signature yang diminta: add, subtract, multiply, dan divide.",
          "2. Tiga operasi pertama langsung mengembalikan hasil aritmatika masing-masing.",
          "3. divide mengembalikan a / b dan nil jika b bukan nol.",
          "4. Jika b == 0, kembalikan 0 dan errors.New(\"pembagi nol\").",
        ],
      },
      {
        name: "format.go",
        starterCode: code`package main

// TODO: Import fmt.

// TODO: Buat formatResult(operation string, value int) string.
// Format yang diminta: ADD = 17

// TODO: Buat formatError(err error) string.
// Format yang diminta: Error: pembagi nol
`,
        clues: [
          "1. Gunakan fmt.Sprintf agar formatting output konsisten.",
          "2. formatResult menerima nama operasi dan nilai, lalu menggabungkannya dengan tanda =.",
          "3. formatError mengambil err.Error() dan menambahkan prefix Error:.",
        ],
      },
    ],
    tests: [
      {
        stdin: "ADD 3 4\nSUB 10 6\nMUL 5 3\n",
        expectedOutput: "ADD = 7\nSUB = 4\nMUL = 15",
      },
      {
        stdin: "DIV 10 2\nDIV 7 3\n",
        expectedOutput: "DIV = 5\nDIV = 2",
      },
      {
        stdin: "DIV 8 0\nADD -2 5\n",
        expectedOutput: "Error: pembagi nol\nADD = 3",
      },
      {
        stdin: "ADD  1  2\nUNKNOWN 3 4\nMUL 2 -4\n",
        expectedOutput: "ADD = 3\nMUL = -8",
      },
    ],
  },
  {
    slug: "mini-project-koleksi",
    kind: "mini_project",
    chapterSlug: "koleksi",
    title: "Mini Project: Inventory Summary",
    description:
      "Bangun pencatat stok sederhana memakai map, slice, append, dan range.",
    instructions: `
Buat pencatat stok yang membaca satu command per baris dari stdin.

- ADD <nama> <jumlah> menambah stok item. ADD berulang harus diakumulasi.
- LIST mencetak semua item berdasarkan nama secara alfabetis dengan format nama: jumlah.
- TOTAL mencetak Total: <jumlah seluruh stok>.
- Command atau input yang tidak valid diabaikan.

Gunakan map untuk menyimpan stok dan slice untuk menghasilkan daftar nama
yang terurut. Starter code hanya berisi komentar panduan.
`.trim(),
    sampleInput: `ADD buku 3
ADD pensil 5
ADD buku 2
LIST
TOTAL
`,
    files: [
      {
        name: "main.go",
        starterCode: code`package main

// TODO: Import bufio, fmt, os, strconv, dan strings.

func main() {
	// TODO: Buat map[string]int untuk menyimpan stok.
	// TODO: Baca command dari stdin sampai EOF.
	// TODO: Untuk ADD, parse nama dan jumlah lalu panggil addStock.
	// TODO: Untuk LIST, ambil nama terurut lalu cetak setiap item.
	// TODO: Untuk TOTAL, hitung seluruh stok lalu cetak hasilnya.
}
`,
        clues: [
          "1. Buat stock := map[string]int{} sebelum loop scanner.",
          "2. Gunakan strings.Fields. Command ADD harus memiliki tepat tiga field.",
          "3. Parse jumlah dengan strconv.Atoi lalu panggil addStock(stock, fields[1], quantity).",
          "4. LIST memakai sortedNames(stock), lalu untuk setiap nama cetak formatStock(nama, stock[nama]).",
          "5. TOTAL memakai totalStock(stock) dan mencetak formatTotal(totalStock(stock)).",
        ],
      },
      {
        name: "inventory.go",
        starterCode: code`package main

// TODO: Import sort.

// TODO: Buat addStock untuk menambah jumlah item pada map.

// TODO: Buat sortedNames untuk mengembalikan semua key map
// dalam urutan alfabetis.

// TODO: Buat totalStock untuk menjumlahkan semua value map.
`,
        clues: [
          "1. addStock cukup melakukan stock[name] += quantity.",
          "2. sortedNames mulai dari slice kosong, range semua key map, lalu append setiap nama.",
          "3. Urutkan slice nama dengan sort.Strings sebelum dikembalikan.",
          "4. totalStock mulai dari 0 dan menambahkan setiap quantity melalui range map.",
        ],
      },
      {
        name: "format.go",
        starterCode: code`package main

// TODO: Import fmt.

// TODO: Buat formatStock(name string, quantity int) string.
// Format yang diminta: buku: 5

// TODO: Buat formatTotal(total int) string.
// Format yang diminta: Total: 5
`,
        clues: [
          "1. Gunakan fmt.Sprintf untuk menghasilkan string, bukan fmt.Println.",
          "2. formatStock memakai urutan nama, titik dua, spasi, lalu jumlah.",
          "3. formatTotal memakai prefix Total: lalu angka total.",
        ],
      },
    ],
    tests: [
      {
        stdin: "ADD buku 3\nADD pensil 5\nLIST\n",
        expectedOutput: "buku: 3\npensil: 5",
      },
      {
        stdin: "ADD buku 3\nADD buku 2\nADD pensil 1\nTOTAL\nLIST\n",
        expectedOutput: "Total: 6\nbuku: 5\npensil: 1",
      },
      {
        stdin: "TOTAL\nADD z 2\nADD a 4\nLIST\nTOTAL\n",
        expectedOutput: "Total: 0\na: 4\nz: 2\nTotal: 6",
      },
      {
        stdin: "ADD kopi 4\nINVALID\nADD teh x\nADD teh 2\nLIST\n",
        expectedOutput: "kopi: 4\nteh: 2",
      },
    ],
  },
  {
    slug: "mini-project-struct-method",
    kind: "mini_project",
    chapterSlug: "struct-method",
    title: "Mini Project: Library Catalog",
    description:
      "Bangun katalog buku terminal memakai struct, receiver method, dan slice.",
    instructions: `
Buat katalog buku yang membaca satu command per baris dari stdin.

- ADD <id> <judul> menambahkan buku baru dalam status tersedia.
- BORROW <id> mengubah buku menjadi dipinjam jika ID ditemukan.
- RETURN <id> mengubah buku menjadi tersedia jika ID ditemukan.
- LIST mencetak buku sesuai urutan ditambahkan:
  101. [tersedia] Go Dasar
  102. [dipinjam] Belajar Struct
- ID yang tidak ditemukan dan command tidak valid diabaikan.

Gunakan struct Book dengan method untuk mengubah statusnya.
`.trim(),
    sampleInput: `ADD 101 Go Dasar
ADD 102 Belajar Struct
BORROW 102
LIST
`,
    files: [
      {
        name: "main.go",
        starterCode: code`package main

// TODO: Import bufio, fmt, os, strconv, dan strings.

func main() {
	// TODO: Buat slice books untuk menyimpan buku sesuai urutan ADD.
	// TODO: Baca command sampai EOF dan abaikan baris kosong.
	// TODO: ADD harus mengambil ID dan seluruh judul setelah ID.
	// TODO: BORROW dan RETURN mencari buku berdasarkan ID lalu memanggil method.
	// TODO: LIST mencetak setiap buku menggunakan formatBook.
}
`,
        clues: [
          "1. Gunakan bufio.NewScanner(os.Stdin) dan strings.Fields untuk membaca command.",
          "2. Pada ADD, fields[1] adalah ID. Ambil judul dari sisa baris setelah command dan ID agar judul boleh memiliki spasi.",
          "3. Tambahkan Book baru dengan Borrowed=false ke slice books.",
          "4. Untuk BORROW dan RETURN, parse ID lalu range slice berdasarkan index agar method pointer mengubah elemen asli.",
          "5. LIST cukup range books dan cetak formatBook(book) dengan fmt.Println.",
        ],
      },
      {
        name: "book.go",
        starterCode: code`package main

// TODO: Definisikan struct Book dengan ID, Title, dan Borrowed.

// TODO: Buat method (b *Book) Borrow untuk menandai buku dipinjam.

// TODO: Buat method (b *Book) Return untuk menandai buku tersedia.
`,
        clues: [
          "1. Field ID bertipe int, Title bertipe string, dan Borrowed bertipe bool.",
          "2. Borrow harus mengubah b.Borrowed menjadi true.",
          "3. Return harus mengubah b.Borrowed menjadi false.",
          "4. Gunakan pointer receiver karena method harus mengubah Book yang ada di dalam slice.",
        ],
      },
      {
        name: "format.go",
        starterCode: code`package main

// TODO: Import fmt.

// TODO: Buat formatBook(book Book) string.
// Tersedia memakai marker [tersedia].
// Dipinjam memakai marker [dipinjam].
`,
        clues: [
          "1. Tentukan marker berdasarkan nilai book.Borrowed.",
          "2. Gunakan fmt.Sprintf dengan urutan ID, marker, dan Title.",
          "3. Format akhir harus seperti 101. [tersedia] Go Dasar.",
        ],
      },
    ],
    tests: [
      {
        stdin: "ADD 101 Go Dasar\nADD 102 Belajar Struct\nLIST\n",
        expectedOutput: "101. [tersedia] Go Dasar\n102. [tersedia] Belajar Struct",
      },
      {
        stdin: "ADD 1 Buku A\nADD 2 Buku B\nBORROW 1\nLIST\nRETURN 1\nLIST\n",
        expectedOutput:
          "1. [dipinjam] Buku A\n2. [tersedia] Buku B\n1. [tersedia] Buku A\n2. [tersedia] Buku B",
      },
      {
        stdin: "ADD 10 Go\nBORROW 99\nRETURN 99\nLIST\n",
        expectedOutput: "10. [tersedia] Go",
      },
      {
        stdin: "ADD 7 Go Lanjutan\nborrow 7\nLIST\n",
        expectedOutput: "7. [dipinjam] Go Lanjutan",
      },
    ],
  },
];
