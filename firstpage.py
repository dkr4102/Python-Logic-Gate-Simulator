import tkinter as tk
from tkinter import Label, messagebox
import and_gate  # Ensure these modules exist
import or_gate
import not_gate

class LogicGateApp:
    def __init__(self, root):
         
        self.root = root
        width = self.root.winfo_screenwidth()
        height = self.root.winfo_screenheight()
        self.root.geometry(f"{width}x{height}")
        self.root.title("LOGIC GATES")
        self.root.configure(bg="#081108")
        


        # Fonts and Labels
        self.font = ('Arial', 35, 'bold',)
        lbl_print = Label (root, 
    text = "\t\tName: Darsh K. Raval\t\tProject Definetion: Make A Basic Gates Using Python GUI", 
    font=("Arial", 14, 'bold', 'underline', ),
    fg="dark green", 
    anchor='w').place(x=40, y=30)

        
        
        # Buttons for AND, OR, NOT
        self.AND_button = tk.Button(self.root, text="AND", font=self.font, command=self.open_and_gate)
        self.AND_button.configure(bg="#4caf50")
        self.OR_button = tk.Button(self.root, text="OR", font=self.font, command=self.open_or_gate)
        self.OR_button.configure(bg="#4caf50")
        self.NOT_button = tk.Button(self.root, text="NOT", font=self.font, command=self.open_not_gate)
        self.NOT_button.configure(bg="#4caf50")
        

        # Exit Button
        self.exit_button = tk.Button(self.root, text="Exit", font=self.font, command=self.root.quit)
        self.exit_button.configure(bg="#BA8781")

        # Placing the buttons with proper alignment
        self.AND_button.place(x=450, y=300, width=160, height=80)
        self.OR_button.place(x=850, y=300, width=160, height=80)
        self.NOT_button.place(x=1250, y=300, width=160, height=80)
        self.exit_button.place(x=850, y=700, width=160, height=80)

    def new_method(self):
        master = tk()
        return master

    def open_and_gate(self):
        self.root.destroy()  # Close the main window
        and_gate_window = tk.Tk()  # Creates a new main window for AND gate
        and_gate.ANDGateApp(and_gate_window)

    def open_or_gate(self):
        self.root.destroy()  # Close the main window
        or_gate_window = tk.Tk()  # Creates a new main window for OR gate
        or_gate.ORGateApp(or_gate_window)  # Ensure this class exists

    def open_not_gate(self):
        self.root.destroy()  # Close the main window
        not_gate_window = tk.Tk()  # Creates a new main window for NOT gate
        not_gate.NOTGateApp(not_gate_window)

if __name__ == "__main__":
    root = tk.Tk()
    app = LogicGateApp(root)
    root.mainloop()
