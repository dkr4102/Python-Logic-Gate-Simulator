import os
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk

# Gate definitions and truth logic
GATES = {
    "AND": {
        "inputs": 2,
        "symbol": "·",
        "formula": "Y = A · B",
        "description": "Output is 1 ONLY if both inputs A and B are 1.",
        "func": lambda a, b=0: a & b,
        "color": "#10b981",
        "img_name": "and_gate.png"
    },
    "OR": {
        "inputs": 2,
        "symbol": "+",
        "formula": "Y = A + B",
        "description": "Output is 1 if at least one input is 1.",
        "func": lambda a, b=0: a | b,
        "color": "#38bdf8",
        "img_name": "or_gate.png"
    },
    "NOT": {
        "inputs": 1,
        "symbol": "Ā",
        "formula": "Y = Ā",
        "description": "Output is inverted: 0 becomes 1, and 1 becomes 0.",
        "func": lambda a, b=0: 1 - a,
        "color": "#f43f5e",
        "img_name": "not_gate.png"
    },
    "NAND": {
        "inputs": 2,
        "symbol": "(A·B)'",
        "formula": "Y = (A · B)'",
        "description": "Universal gate. Output is 0 ONLY if both inputs are 1.",
        "func": lambda a, b=0: 1 - (a & b),
        "color": "#f59e0b",
        "img_name": "and_gate.png"
    },
    "NOR": {
        "inputs": 2,
        "symbol": "(A+B)'",
        "formula": "Y = (A + B)'",
        "description": "Universal gate. Output is 1 ONLY if all inputs are 0.",
        "func": lambda a, b=0: 1 - (a | b),
        "color": "#ec4899",
        "img_name": "or_gate.png"
    },
    "XOR": {
        "inputs": 2,
        "symbol": "⊕",
        "formula": "Y = A ⊕ B",
        "description": "Exclusive OR. Output is 1 if inputs are strictly different.",
        "func": lambda a, b=0: a ^ b,
        "color": "#8b5cf6",
        "img_name": "or_gate.png"
    },
    "XNOR": {
        "inputs": 2,
        "symbol": "⊙",
        "formula": "Y = (A ⊕ B)'",
        "description": "Equivalence gate. Output is 1 if inputs are identical.",
        "func": lambda a, b=0: 1 - (a ^ b),
        "color": "#06b6d4",
        "img_name": "and_gate.png"
    },
    "BUFFER": {
        "inputs": 1,
        "symbol": "A",
        "formula": "Y = A",
        "description": "Signal amplifier / buffer. Output strictly mirrors input.",
        "func": lambda a, b=0: a,
        "color": "#14b8a6",
        "img_name": "not_gate.png"
    }
}

THEMES = {
    "Dark Modern": {
        "bg": "#0b0f19",
        "card_bg": "#151c2c",
        "card_border": "#232f48",
        "text_primary": "#f8fafc",
        "text_muted": "#94a3b8",
        "btn_active": "#3b82f6"
    },
    "Light Clean": {
        "bg": "#f8fafc",
        "card_bg": "#ffffff",
        "card_border": "#e2e8f0",
        "text_primary": "#0f172a",
        "text_muted": "#64748b",
        "btn_active": "#2563eb"
    },
    "Rajwada Palace": {
        "bg": "#2d0a12",
        "card_bg": "#43121b",
        "card_border": "#d4af37",
        "text_primary": "#fef08a",
        "text_muted": "#f5d061",
        "btn_active": "#d4af37"
    }
}

class ModernSimulatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Digital Logic Gate Simulator Pro - Darsh K. Raval")
        self.current_theme = "Dark Modern"
        self.current_gate = "AND"
        self.input_a = 0
        self.input_b = 0
        self.img_cache = {}

        # Sizing
        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()
        win_w = min(1180, max(960, int(screen_w * 0.85)))
        win_h = min(820, max(680, int(screen_h * 0.85)))
        pos_x = max(0, (screen_w - win_w) // 2)
        pos_y = max(0, (screen_h - win_h) // 2)
        self.root.geometry(f"{win_w}x{win_h}+{pos_x}+{pos_y}")
        self.root.minsize(920, 640)

        self.apply_theme_colors()
        self.build_ui()
        self.update_simulation()

    def get_palette(self):
        return THEMES[self.current_theme]

    def apply_theme_colors(self):
        p = self.get_palette()
        self.root.configure(bg=p["bg"])

    def build_ui(self):
        p = self.get_palette()

        # Top Navigation Bar
        self.navbar = tk.Frame(self.root, bg=p["card_bg"], bd=1, relief="solid")
        self.navbar.pack(fill="x", padx=15, pady=(15, 10))

        home_btn = tk.Button(self.navbar, text="← First Page", font=('Arial', 10, 'bold'),
                             bg=p["card_border"], fg=p["text_primary"], relief="flat", cursor="hand2",
                             padx=12, pady=6, command=self.go_to_firstpage)
        home_btn.pack(side="left", padx=12, pady=10)

        self.nav_title = tk.Label(self.navbar, text="DIGITAL LOGIC GATE SIMULATOR PRO",
                                  font=('Arial', 16, 'bold'), bg=p["card_bg"], fg=p["text_primary"])
        self.nav_title.pack(side="left", padx=10)

        # Theme selector dropdown
        theme_box = tk.Frame(self.navbar, bg=p["card_bg"])
        theme_box.pack(side="right", padx=12)

        tk.Label(theme_box, text="Theme:", font=('Arial', 10), bg=p["card_bg"], fg=p["text_muted"]).pack(side="left", padx=5)
        self.theme_var = tk.StringVar(value=self.current_theme)
        theme_menu = ttk.Combobox(theme_box, textvariable=self.theme_var, values=list(THEMES.keys()), state="readonly", width=14)
        theme_menu.pack(side="left", padx=5)
        theme_menu.bind("<<ComboboxSelected>>", self.on_theme_changed)

        # Gate Selector Tabs
        self.tabs_frame = tk.Frame(self.root, bg=p["bg"])
        self.tabs_frame.pack(fill="x", padx=15, pady=5)

        self.gate_buttons = {}
        for gate_name in GATES.keys():
            btn = tk.Button(self.tabs_frame, text=gate_name, font=('Arial', 11, 'bold'),
                            relief="flat", cursor="hand2", padx=14, pady=8,
                            command=lambda g=gate_name: self.switch_gate(g))
            btn.pack(side="left", padx=4, pady=2)
            self.gate_buttons[gate_name] = btn

        # Main Content Layout: Left (Circuit Sandbox) and Right (Truth Table & Theory)
        self.main_split = tk.Frame(self.root, bg=p["bg"])
        self.main_split.pack(fill="both", expand=True, padx=15, pady=10)

        # Left Panel (Circuit View)
        self.left_panel = tk.Frame(self.main_split, bg=p["card_bg"], bd=1, relief="solid")
        self.left_panel.pack(side="left", fill="both", expand=True, padx=(0, 10))

        # Gate Title & Formula Display
        self.gate_header = tk.Label(self.left_panel, text="", font=('Arial', 20, 'bold'),
                                    bg=p["card_bg"], fg="#10b981")
        self.gate_header.pack(pady=(15, 2))

        self.formula_label = tk.Label(self.left_panel, text="", font=('Courier', 14, 'bold'),
                                      bg=p["card_bg"], fg=p["text_primary"])
        self.formula_label.pack(pady=2)

        self.desc_label = tk.Label(self.left_panel, text="", font=('Arial', 10),
                                   bg=p["card_bg"], fg=p["text_muted"], wraplength=400)
        self.desc_label.pack(pady=4)

        # Schematic Display
        self.schematic_lbl = tk.Label(self.left_panel, bg=p["card_bg"])
        self.schematic_lbl.pack(pady=10)

        # Interactive Input Toggles
        self.toggles_frame = tk.Frame(self.left_panel, bg=p["card_bg"])
        self.toggles_frame.pack(pady=10)

        # Input A Toggle
        self.input_a_box = tk.Frame(self.toggles_frame, bg=p["card_bg"])
        self.input_a_box.pack(side="left", padx=20)
        tk.Label(self.input_a_box, text="Input A", font=('Arial', 12, 'bold'), bg=p["card_bg"], fg=p["text_muted"]).pack()
        self.btn_toggle_a = tk.Button(self.input_a_box, text="0", font=('Arial', 20, 'bold'), width=4,
                                      bg="#334155", fg="#ffffff", cursor="hand2", relief="flat", command=self.toggle_a)
        self.btn_toggle_a.pack(pady=5)

        # Input B Toggle (hidden if single input gate like NOT)
        self.input_b_box = tk.Frame(self.toggles_frame, bg=p["card_bg"])
        self.input_b_box.pack(side="left", padx=20)
        tk.Label(self.input_b_box, text="Input B", font=('Arial', 12, 'bold'), bg=p["card_bg"], fg=p["text_muted"]).pack()
        self.btn_toggle_b = tk.Button(self.input_b_box, text="0", font=('Arial', 20, 'bold'), width=4,
                                      bg="#334155", fg="#ffffff", cursor="hand2", relief="flat", command=self.toggle_b)
        self.btn_toggle_b.pack(pady=5)

        # Output Display
        self.output_box = tk.Frame(self.toggles_frame, bg=p["card_bg"])
        self.output_box.pack(side="left", padx=20)
        tk.Label(self.output_box, text="Output Y", font=('Arial', 12, 'bold'), bg=p["card_bg"], fg=p["text_muted"]).pack()
        self.lbl_output = tk.Label(self.output_box, text="0", font=('Arial', 20, 'bold'), width=4,
                                   bg="#0f172a", fg="#10b981", relief="solid", bd=1)
        self.lbl_output.pack(pady=5)

        # Right Panel (Truth Table & Information)
        self.right_panel = tk.Frame(self.main_split, bg=p["card_bg"], bd=1, relief="solid", width=380)
        self.right_panel.pack(side="right", fill="both", padx=(10, 0))
        self.right_panel.pack_propagate(False)

        tk.Label(self.right_panel, text="TRUTH TABLE", font=('Arial', 15, 'bold'),
                 bg=p["card_bg"], fg=p["text_primary"]).pack(pady=(15, 10))

        # Truth Table Container Frame
        self.table_frame = tk.Frame(self.right_panel, bg=p["card_bg"])
        self.table_frame.pack(fill="x", padx=20, pady=5)

        # Knowledge Card
        self.theory_box = tk.Frame(self.right_panel, bg=p["bg"], bd=1, relief="solid")
        self.theory_box.pack(fill="both", expand=True, padx=20, pady=15)

        tk.Label(self.theory_box, text="Engineering Notes:", font=('Arial', 11, 'bold'),
                 bg=p["bg"], fg=p["text_primary"]).pack(anchor="w", padx=12, pady=(10, 4))

        self.theory_text = tk.Label(self.theory_box, text="", font=('Arial', 10),
                                    bg=p["bg"], fg=p["text_muted"], justify="left", wraplength=320)
        self.theory_text.pack(anchor="w", padx=12, pady=4)

    def on_theme_changed(self, event=None):
        self.current_theme = self.theme_var.get()
        p = self.get_palette()
        self.root.configure(bg=p["bg"])
        self.navbar.configure(bg=p["card_bg"])
        self.nav_title.configure(bg=p["card_bg"], fg=p["text_primary"])
        self.left_panel.configure(bg=p["card_bg"])
        self.right_panel.configure(bg=p["card_bg"])
        self.gate_header.configure(bg=p["card_bg"])
        self.formula_label.configure(bg=p["card_bg"], fg=p["text_primary"])
        self.desc_label.configure(bg=p["card_bg"], fg=p["text_muted"])
        self.schematic_lbl.configure(bg=p["card_bg"])
        self.toggles_frame.configure(bg=p["card_bg"])
        self.input_a_box.configure(bg=p["card_bg"])
        self.input_b_box.configure(bg=p["card_bg"])
        self.output_box.configure(bg=p["card_bg"])
        self.table_frame.configure(bg=p["card_bg"])
        self.theory_box.configure(bg=p["bg"])
        self.theory_text.configure(bg=p["bg"], fg=p["text_muted"])
        self.update_simulation()

    def switch_gate(self, gate_name):
        self.current_gate = gate_name
        self.update_simulation()

    def toggle_a(self):
        self.input_a = 1 - self.input_a
        self.update_simulation()

    def toggle_b(self):
        self.input_b = 1 - self.input_b
        self.update_simulation()

    def update_simulation(self):
        g = GATES[self.current_gate]
        p = self.get_palette()

        # Update tabs button visual state
        for name, btn in self.gate_buttons.items():
            if name == self.current_gate:
                btn.configure(bg=g["color"], fg="#ffffff")
            else:
                btn.configure(bg=p["card_bg"], fg=p["text_muted"])

        # Update texts
        self.gate_header.configure(text=f"{self.current_gate} GATE", fg=g["color"])
        self.formula_label.configure(text=g["formula"])
        self.desc_label.configure(text=g["description"])

        # Inputs visibility
        if g["inputs"] == 1:
            self.input_b_box.pack_forget()
        else:
            self.input_b_box.pack(side="left", padx=20)

        # Update input toggles styling
        self.btn_toggle_a.configure(
            text=str(self.input_a),
            bg="#10b981" if self.input_a == 1 else "#334155"
        )
        self.btn_toggle_b.configure(
            text=str(self.input_b),
            bg="#10b981" if self.input_b == 1 else "#334155"
        )

        # Calculate output
        out_val = g["func"](self.input_a, self.input_b)
        self.lbl_output.configure(
            text=str(out_val),
            bg=g["color"] if out_val == 1 else "#0f172a",
            fg="#ffffff" if out_val == 1 else "#64748b"
        )

        # Load image safely
        img_file = g.get("img_name", "and_gate.png")
        self.display_image(img_file)

        # Render truth table
        self.render_truth_table()

        # Theory notes
        notes = {
            "AND": "• Realized in TTL logic using 7408 IC chip (Quad 2-Input AND).\n• Both diodes or transistors must be biased ON for conduction.",
            "OR": "• Realized in TTL logic using 7432 IC chip (Quad 2-Input OR).\n• Parallel transistor topology conducts if either branch is active.",
            "NOT": "• Realized using 7404 IC chip (Hex Inverter).\n• A single NPN common-emitter transistor inverts the base input voltage.",
            "NAND": "• Realized using 7400 IC chip.\n• Universal gate: Can implement ANY Boolean logic circuit by itself!",
            "NOR": "• Realized using 7402 IC chip.\n• Universal gate: Capable of building SR latches and memory registers.",
            "XOR": "• Realized using 7486 IC chip (Quad 2-Input XOR).\n• Critical in digital arithmetic: Forms the Sum bit of Half/Full Adders.",
            "XNOR": "• Realized using 74266 IC chip.\n• Used in digital parity checkers, bit comparators, and error detection.",
            "BUFFER": "• Realized using 7407 IC chip.\n• Increases fan-out current without altering signal logic state."
        }
        self.theory_text.configure(text=notes.get(self.current_gate, ""))

    def display_image(self, filename):
        candidates = [
            os.path.join(os.path.dirname(__file__), "..", filename),
            os.path.join(os.path.dirname(__file__), "..", "assets", filename)
        ]
        path = next((p for p in candidates if os.path.exists(p)), None)
        if path:
            try:
                if path not in self.img_cache:
                    raw = Image.open(path)
                    resized = raw.resize((280, 160), Image.Resampling.LANCZOS)
                    self.img_cache[path] = ImageTk.PhotoImage(resized)
                self.schematic_lbl.configure(image=self.img_cache[path], text="")
                return
            except Exception:
                pass
        self.schematic_lbl.configure(image="", text=f"[{self.current_gate} Gate Schematic]",
                                     font=('Courier', 14, 'bold'), fg=GATES[self.current_gate]["color"])

    def render_truth_table(self):
        p = self.get_palette()
        g = GATES[self.current_gate]

        # Clear existing rows
        for child in self.table_frame.winfo_children():
            child.destroy()

        # Header Row
        headers = ["A", "Y"] if g["inputs"] == 1 else ["A", "B", "Y"]
        for col_idx, h in enumerate(headers):
            lbl = tk.Label(self.table_frame, text=h, font=('Arial', 11, 'bold'),
                           bg=p["card_border"], fg=p["text_primary"], width=6, pady=4)
            lbl.grid(row=0, column=col_idx, padx=2, pady=2)

        # Rows
        combinations = [(0,), (1,)] if g["inputs"] == 1 else [(0,0), (0,1), (1,0), (1,1)]

        for r_idx, comb in enumerate(combinations, start=1):
            if g["inputs"] == 1:
                is_active = (comb[0] == self.input_a)
                out = g["func"](comb[0])
                vals = [str(comb[0]), str(out)]
            else:
                is_active = (comb[0] == self.input_a and comb[1] == self.input_b)
                out = g["func"](comb[0], comb[1])
                vals = [str(comb[0]), str(comb[1]), str(out)]

            row_bg = g["color"] if is_active else p["bg"]
            row_fg = "#ffffff" if is_active else p["text_primary"]

            for c_idx, val in enumerate(vals):
                lbl = tk.Label(self.table_frame, text=val, font=('Arial', 11, 'bold' if is_active else 'normal'),
                               bg=row_bg, fg=row_fg, width=6, pady=5)
                lbl.grid(row=r_idx, column=c_idx, padx=2, pady=2)

    def go_to_firstpage(self):
        self.root.destroy()
        import firstpage
        new_root = tk.Tk()
        firstpage.LogicGateApp(new_root)
        new_root.mainloop()

if __name__ == "__main__":
    root = tk.Tk()
    app = ModernSimulatorApp(root)
    root.mainloop()
