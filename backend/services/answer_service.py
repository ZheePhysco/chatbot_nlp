def build_answer(
    pertanyaan,
    hasil_sentence
):
    if len(hasil_sentence) == 0:
        return (
            "Maaf, saya tidak menemukan jawaban yang relevan."
        )

    terbaik = hasil_sentence[0]["score"]

    if terbaik < 0.25:
        return (
            "Maaf, jawaban tidak ditemukan pada materi."
        )

    if terbaik > 0.80:
        jumlah = 1
    elif terbaik > 0.60:
        jumlah = 2
    else:
        jumlah = 3

    jawaban = "Berdasarkan materi:\n\n"

    sudah = set()

    for item in hasil_sentence:
        if len(sudah) >= jumlah:
            break
        if item["text"] in sudah:
            continue
        sudah.add(item["text"])
        jawaban += "• "
        jawaban += item["text"]
        jawaban += "\n"

    return jawaban