import os
import tkinter as tk
from tkinter import Label, messagebox
from PIL import Image, ImageTk

class NOTGateApp:
    def __init__(self, root):
        self.root = root
        self.root.title("NOT GATE (Inverter) - Logic Gate Simulator")
        self.root.configure(bg="#0d1117")

        # Set responsive window size (minimum 900x650)
        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()
        win_w = min(1050, max(850, int(screen_w * 0.75)))
        win_h = min(750, max(600, int(screen_h * 0.75)))
        pos_x = max(0, (screen_w - win_w) // 2)
        pos_y = max(0, (screen_h - win_h) // 2)
        self.root.geometry(f"{win_w}x{win_h}+{pos_x}+{pos_y}")
        self.root.minsize(800, 550)

        # Header Frame
        header = tk.Frame(self.root, bg="#0d1117")
        header.pack(fill="x", padx=20, pady=15)

        back_btn = tk.Button(header, text="← Back", font=('Arial', 12, 'bold'),
                             bg="#21262d", fg="#e6edf3", activebackground="#30363d", activeforeground="#ffffff",
                             relief="flat", cursor="hand2", padx=14, pady=6, command=self.go_back)
        back_btn.pack(side="left")

        title = Label(header, text="NOT GATE (INVERTER) SIMULATOR", font=('Arial', 24, 'bold'),
                      bg="#0d1117", fg="#f43f5e")
        title.pack(side="left", expand=True)

        subtitle = Label(self.root, text="Formula: Y = Ā (Output is the exact opposite / negation of Input A)",
                         font=('Arial', 12, 'italic'), bg="#0d1117", fg="#8b949e")
        subtitle.pack(pady=5)

        # Main Workspace Frame
        content_frame = tk.Frame(self.root, bg="#161b22", bd=1, relief="solid")
        content_frame.pack(fill="both", expand=True, padx=30, pady=15)

        # Circuit schematic display
        self.img = None
        self.load_schematic(content_frame)

        # Interactive Controls Frame
        ctrl_frame = tk.Frame(content_frame, bg="#161b22")
        ctrl_frame.pack(pady=20)

        # Input A
        Label(ctrl_frame, text="Input A:", font=('Arial', 14, 'bold'), bg="#161b22", fg="#58a6ff").grid(row=0, column=0, padx=10, pady=10, sticky="e")
        self.T1 = tk.Entry(ctrl_frame, font=('Arial', 16, 'bold'), width=5, justify='center', bg="#0d1117", fg="#ffffff", insertbackground="#ffffff", relief="flat")
        self.T1.grid(row=0, column=1, padx=10, pady=10)
        self.T1.insert(0, "0")

        # Quick Toggle Buttons for Input A
        tk.Button(ctrl_frame, text="Set 0", font=('Arial', 9), bg="#21262d", fg="#c9d1d9",
                  command=lambda: self.set_input("0")).grid(row=0, column=2, padx=2)
        tk.Button(ctrl_frame, text="Set 1", font=('Arial', 9), bg="#21262d", fg="#c9d1d9",
                  command=lambda: self.set_input("1")).grid(row=0, column=3, padx=2)

        # Output Y
        Label(ctrl_frame, text="Output Y (Ā):", font=('Arial', 14, 'bold'), bg="#161b22", fg="#f43f5e").grid(row=1, column=0, padx=10, pady=10, sticky="e")
        self.T3 = tk.Entry(ctrl_frame, font=('Arial', 16, 'bold'), width=5, justify='center', state='readonly', readonlybackground="#0d1117", fg="#f43f5e", relief="flat")
        self.T3.grid(row=1, column=1, padx=10, pady=10)

        self.status_lbl = Label(ctrl_frame, text="Status: Ready", font=('Arial', 11), bg="#161b22", fg="#8b949e")
        self.status_lbl.grid(row=1, column=2, columnspan=2, padx=10, sticky="w")

        # Action Buttons
        btn_box = tk.Frame(self.root, bg="#0d1117")
        btn_box.pack(pady=15)

        calc_btn = tk.Button(btn_box, text="⚡ Calculate Output (Y = Ā)", font=('Arial', 13, 'bold'),
                             bg="#e11d48", fg="#ffffff", activebackground="#be123c", activeforeground="#ffffff",
                             cursor="hand2", padx=20, pady=10, relief="flat", command=self.calculate_not)
        calc_btn.pack(side="left", padx=10)

        exit_btn = tk.Button(btn_box, text="Exit App", font=('Arial', 12),
                             bg="#21262d", fg="#f85149", activebackground="#30363d",
                             cursor="hand2", padx=16, pady=10, relief="flat", command=self.root.destroy)
        exit_btn.pack(side="left", padx=10)

        # Initial calculation
        self.calculate_not()

    def load_schematic(self, parent):
        candidates = [
            os.path.join(os.path.dirname(__file__), "not_gate.png"),
            os.path.join(os.path.dirname(__file__), "assets", "not_gate.png")
        ]
        img_path = next((p for p in candidates if os.path.exists(p)), None)

        if img_path:
            try:
                raw_img = Image.open(img_path)
                resized = raw_img.resize((300, 180), Image.Resampling.LANCZOS)
                self.img = ImageTk.PhotoImage(resized)
                img_lbl = Label(parent, image=self.img, bg="#161b22")
                img_lbl.pack(pady=15)
                return
            except Exception:
                pass

        fallback = Label(parent, text="[ NOT GATE SCHEMATIC: Y = Ā ]",
                         font=('Courier', 16, 'bold'), bg="#161b22", fg="#f43f5e", pady=30)
        fallback.pack()

    def set_input(self, val):
        self.T1.delete(0, tk.END)
        self.T1.insert(0, val)
        self.calculate_not()

    def calculate_not(self):
        input1 = self.T1.get().strip()

        if input1 in ['0', '1']:
            result = str(1 - int(input1))
            self.T3.config(state='normal')
            self.T3.delete(0, tk.END)
            self.T3.insert(0, result)
            self.T3.config(state='readonly')
            if result == '1':
                self.status_lbl.config(text="Status: HIGH (True)", fg="#f43f5e")
            else:
                self.status_lbl.config(text="Status: LOW (False)", fg="#8b949e")
        else:
            messagebox.showerror("Invalid Input", "Please enter 0 or 1 only.")

    def go_back(self):
        self.root.destroy()
        import firstpage
        new_root = tk.Tk()
        firstpage.LogicGateApp(new_root)
        new_root.mainloop()

if __name__ == "__main__":
    root = tk.Tk()
    app = NOTGateApp(root)
    root.mainloop()