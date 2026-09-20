import os
import sys
import webbrowser
import tkinter as tk
from tkinter import Label, messagebox

class LogicGateApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Digital Logic Gate Simulator - Darsh K. Raval")
        self.root.configure(bg="#0b0f19")

        # Responsive window sizing
        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()
        win_w = min(1100, max(900, int(screen_w * 0.8)))
        win_h = min(800, max(650, int(screen_h * 0.8)))
        pos_x = max(0, (screen_w - win_w) // 2)
        pos_y = max(0, (screen_h - win_h) // 2)
        self.root.geometry(f"{win_w}x{win_h}+{pos_x}+{pos_y}")
        self.root.minsize(850, 600)

        # Header Section
        header_frame = tk.Frame(self.root, bg="#111827", bd=1, relief="solid")
        header_frame.pack(fill="x", padx=25, pady=20)

        title_lbl = Label(header_frame, text="LOGIC GATE SIMULATOR",
                          font=('Arial', 28, 'bold'), bg="#111827", fg="#38bdf8")
        title_lbl.pack(pady=(15, 5))

        info_lbl = Label(header_frame,
                         text="Developer: Darsh K. Raval  |  Project: Digital Logic Gates & Circuit Simulator",
                         font=('Arial', 12, 'bold'), bg="#111827", fg="#10b981")
        info_lbl.pack(pady=(0, 15))

        # Action callout banner
        banner = tk.Frame(self.root, bg="#1e293b")
        banner.pack(fill="x", padx=25, pady=5)

        banner_text = Label(banner, text="⚡ Choose a gate below to simulate, or launch the Next-Gen Web Simulator with 6 Themes & Audio!",
                            font=('Arial', 11), bg="#1e293b", fg="#94a3b8")
        banner_text.pack(side="left", padx=15, pady=10)

        web_btn = tk.Button(banner, text="🌐 Launch Web Simulator", font=('Arial', 11, 'bold'),
                            bg="#8b5cf6", fg="#ffffff", activebackground="#7c3aed", activeforeground="#ffffff",
                            cursor="hand2", padx=14, pady=6, relief="flat", command=self.open_web_app)
        web_btn.pack(side="right", padx=15, pady=6)

        # Gate Cards Container
        gates_frame = tk.Frame(self.root, bg="#0b0f19")
        gates_frame.pack(fill="both", expand=True, padx=25, pady=20)

        # Grid configuration
        gates_frame.columnconfigure(0, weight=1)
        gates_frame.columnconfigure(1, weight=1)
        gates_frame.columnconfigure(2, weight=1)

        # Gate 1: AND
        self.create_gate_card(gates_frame, 0, 0, "AND GATE", "Y = A · B",
                              "True only if both inputs are 1", "#10b981", self.open_and_gate)

        # Gate 2: OR
        self.create_gate_card(gates_frame, 0, 1, "OR GATE", "Y = A + B",
                              "True if at least one input is 1", "#0284c7", self.open_or_gate)

        # Gate 3: NOT
        self.create_gate_card(gates_frame, 0, 2, "NOT GATE", "Y = Ā",
                              "Inverts input: 0 becomes 1, 1 becomes 0", "#e11d48", self.open_not_gate)

        # Gate 4: Modern All-In-One Desktop App
        self.create_gate_card(gates_frame, 1, 0, "ALL GATES PRO", "AND / OR / NOT / NAND / XOR...",
                              "All 8 digital gates in one interactive window", "#f59e0b", self.open_unified_app)

        # Gate 5: Web UI Direct Link
        self.create_gate_card(gates_frame, 1, 1, "MULTI-THEME WEB", "6 Curated Themes",
                              "Light, Dark, Aesthetic, Rajwada, Indian, Modern", "#a855f7", self.open_web_app)

        # Gate 6: Compound Circuits
        self.create_gate_card(gates_frame, 1, 2, "CIRCUIT LAB", "Adders & Latches",
                              "Simulate Half Adder, Full Adder & Flip-Flops", "#06b6d4", self.open_web_circuits)

        # Bottom Bar
        bottom_bar = tk.Frame(self.root, bg="#0b0f19")
        bottom_bar.pack(fill="x", padx=25, pady=15)

        exit_btn = tk.Button(bottom_bar, text="✕ Exit Application", font=('Arial', 12, 'bold'),
                             bg="#27272a", fg="#f43f5e", activebackground="#3f3f46", activeforeground="#ffffff",
                             cursor="hand2", padx=24, pady=10, relief="flat", command=self.root.destroy)
        exit_btn.pack(side="right")

    def create_gate_card(self, parent, r, c, title, formula, desc, accent_color, cmd):
        card = tk.Frame(parent, bg="#161e2e", bd=1, relief="solid", highlightbackground=accent_color, highlightthickness=1)
        card.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")

        lbl_t = Label(card, text=title, font=('Arial', 16, 'bold'), bg="#161e2e", fg=accent_color)
        lbl_t.pack(pady=(15, 5))

        lbl_f = Label(card, text=formula, font=('Courier', 13, 'bold'), bg="#161e2e", fg="#e2e8f0")
        lbl_f.pack(pady=3)

        lbl_d = Label(card, text=desc, font=('Arial', 10), bg="#161e2e", fg="#94a3b8", wraplength=220)
        lbl_d.pack(pady=(4, 15))

        btn = tk.Button(card, text="Open Simulator →", font=('Arial', 11, 'bold'),
                        bg=accent_color, fg="#ffffff", activebackground="#ffffff", activeforeground=accent_color,
                        cursor="hand2", padx=12, pady=8, relief="flat", command=cmd)
        btn.pack(pady=(0, 15))

    def open_and_gate(self):
        self.root.destroy()
        import and_gate
        sub_window = tk.Tk()
        and_gate.ANDGateApp(sub_window)
        sub_window.mainloop()

    def open_or_gate(self):
        self.root.destroy()
        import or_gate
        sub_window = tk.Tk()
        or_gate.ORGateApp(sub_window)
        sub_window.mainloop()

    def open_not_gate(self):
        self.root.destroy()
        import not_gate
        sub_window = tk.Tk()
        not_gate.NOTGateApp(sub_window)
        sub_window.mainloop()

    def open_unified_app(self):
        unified_script = os.path.join(os.path.dirname(__file__), "python_app", "simulator.py")
        if os.path.exists(unified_script):
            self.root.destroy()
            import python_app.simulator as sim
            sub_window = tk.Tk()
            sim.ModernSimulatorApp(sub_window)
            sub_window.mainloop()
        else:
            self.open_and_gate()

    def open_web_app(self):
        index_file = os.path.join(os.path.dirname(__file__), "index.html")
        if os.path.exists(index_file):
            webbrowser.open(f"file://{os.path.abspath(index_file)}")
        else:
            messagebox.showinfo("Web App", "Building the web app files now...")

    def open_web_circuits(self):
        index_file = os.path.join(os.path.dirname(__file__), "index.html")
        if os.path.exists(index_file):
            webbrowser.open(f"file://{os.path.abspath(index_file)}#circuits")

if __name__ == "__main__":
    root = tk.Tk()
    app = LogicGateApp(root)
    root.mainloop()
