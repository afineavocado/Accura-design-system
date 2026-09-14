# Quy trình làm việc nhóm trên Git

Tài liệu này dành cho **hai người cùng làm prototype Accura bằng AI agent**, mỗi người một
module. Viết bằng tiếng Việt vì đây là quy trình cho người, không phải spec kỹ thuật.

| | Module | Thư mục |
|---|---|---|
| Lam | Training | `accura-ui/src/app/prototype/accura/training/` |
| Đồng nghiệp | Documents | `accura-ui/src/app/prototype/accura/documents/` |

**Repo:** `github.com/afineavocado/Accura-design-system` · nhánh chính: `main`

> **Git không tự đồng bộ.** Không có cơ chế nào đẩy code từ máy người này sang máy người kia.
> Phải chủ động `pull`. Thứ duy nhất tự động được là *thông báo*, không phải bản thân code.

---

## Phần 0 — Cài đặt một lần

**Chủ repo:**

1. Đồng nghiệp tạo tài khoản GitHub miễn phí → gửi **username**
2. Repo → **Settings** → **Collaborators** → **Add people** → nhập username → gửi lời mời
3. **Settings** → **General** → mục **Pull Requests** → tick **Automatically delete head branches**
4. Cân nhắc chuyển sang **private** nếu prototype có dữ liệu thật hoặc nội dung nội bộ Accura.
   Collaborator không giới hạn và vẫn miễn phí.

**Đồng nghiệp:**

5. Mở email mời → **Accept invitation**
6. Cài **GitHub Desktop**, đăng nhập tài khoản *của mình*
7. **File** → **Clone repository** → chọn `Accura-design-system`
8. Chạy thử: `cd accura-ui && npm install && npm run dev` → mở `localhost:3001`

> ⚠️ **Mỗi người một tài khoản.** Dùng chung một tài khoản thì mọi commit mang cùng một tên —
> mất hoàn toàn khả năng trả lời "ai sửa cái này, sao lại mất". Với repo mà hai agent cùng sửa
> thì đó là công cụ chẩn đoán quan trọng nhất. Ngoài ra 2FA sẽ nằm trên điện thoại một người.
> Tài khoản cá nhân và private repo đều miễn phí — dùng chung không tiết kiệm được gì.

---

## Phần 1 — Mỗi sáng, trước khi mở agent

Cả hai người, không bỏ bước nào.

**1. Commit hoặc bỏ hết việc đang dở.**
GitHub Desktop phải hiện *"No local changes"*.
→ *Còn file chưa commit mà đổi branch là lúc thư mục `flow/` từng biến mất vì bị tự động stash.*

**2. Về `main` và pull.**
**Current Branch** → `main` → **Fetch origin** → **Pull origin**

**3. Tạo branch cho việc hôm nay.**
**Current Branch** → **New Branch**. Đặt tên theo module:

```
training/review-queue
documents/filter-row
```

**4. Dọn cache rồi chạy.**

```bash
cd accura-ui && rm -rf .next && npm run dev
```

→ *Bỏ `rm -rf .next` sẽ có lúc nhìn màn hình cũ rồi tưởng git hỏng. Đã xảy ra 5+ lần trong repo
này. Nếu `package.json` vừa thay đổi thì chạy thêm `npm install`.*

---

## Phần 2 — Trong lúc làm việc

**5. Nói rõ với agent đang làm module nào**, ví dụ *"chỉ sửa trong `.../training/`"*.

**6. File dùng chung — nhắn nhau trước khi sửa.**

| File | Vì sao |
|---|---|
| `prototype/accura/app-sidebar.tsx` | cả hai module nằm chung sidebar |
| `accura-ui/src/app/tokens.css` | token dùng chung |
| `accura-ui/src/components/ui/*` | design system dùng chung |
| `CLAUDE.md` · `README.md` · `CHANGELOG.md` | tài liệu chung |

**7. Commit nhỏ, thường xuyên.** Xong một việc là commit. Một commit sửa 40 file thì conflict
gần như không gỡ được; năm commit nhỏ thì gỡ từng cái dễ hơn nhiều.

Nếu có động vào token hoặc spec, chạy trước khi commit:

```bash
node docs/machine-readable/sync-doc-values.mjs --write
node docs/machine-readable/drift-check.mjs
```

**8. Đọc diff trước khi commit.** Thấy file lạ mà mình không yêu cầu sửa → bỏ tick file đó.
→ *Đây là chỗ bắt được việc agent tự ý làm thêm ngoài yêu cầu — đã xảy ra vài lần.*

---

## Phần 3 — Cuối ngày

**9. Push branch.** **Publish branch** (lần đầu) hoặc **Push origin**.

**10. Mở Pull Request.** GitHub hiện **Compare & pull request** → viết một dòng mô tả → **Create**.

**11. Xem toàn bộ diff** ở tab **Files changed**. Đây là lần kiểm tra cuối, đặc biệt phần đụng
vào file dùng chung.

**12. Merge.** Nếu báo *"Able to merge"* → **Merge pull request** → **Confirm**.
Nếu báo conflict → xem Phần 5.

**13. Người còn lại cập nhật branch của mình.**
**Branch** → **Update from main**
→ *Bỏ bước này thì branch càng ngày càng lệch, hôm sau merge đau gấp đôi.*

---

## Phần 4 — Lấy bản mới nhất của người kia

**Fetch origin** → **Pull origin** → `rm -rf .next` → `npm run dev`

Muốn biết *khi nào* cần pull: vào repo → **Watch** → **All Activity** → nhận email mỗi commit mới.
Vẫn phải tự pull.

---

## Phần 5 — Khi bị conflict

**Đừng để agent tự merge.**

1. PR chỉ ra file nào conflict
2. Về branch của mình → **Branch** → **Update from main**
3. Mở file, tìm `<<<<<<<` `=======` `>>>>>>>`
4. Giữ phần đúng, xoá dấu phân cách. **Với file dùng chung thường phải giữ cả hai bên**, không
   phải chọn một
5. Commit, push lại — PR tự cập nhật

---

## Bốn nguyên tắc gói gọn

1. **Pull trước khi làm, push trước khi nghỉ.** Branch sống càng lâu càng khó merge. Feature cần
   3 ngày thì vẫn merge phần đã xong mỗi ngày, miễn không vỡ build.
2. **Không ai commit thẳng vào `main`** — kể cả chủ repo. `main` chỉ thay đổi khi merge PR.
3. **Commit hết rồi mới đổi branch.** Việc chưa commit là việc mà tool cảm thấy được phép di chuyển.
4. **`rm -rf .next` sau mỗi lần pull hoặc đổi branch** — trước khi kết luận "git hỏng".
