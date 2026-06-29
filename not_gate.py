import tkinter as tk
import firstpage
from tkinter import Label,messagebox
from PIL import Image, ImageTk  # Make sure you have the pillow library installed
class NOTGateApp:
    def __init__(self, root):
        self.root = root
        width = self.root.winfo_screenwidth()
        height = self.root.winfo_screenheight()
        self.root.geometry(f"{width}x{height}")
        self.root.title("NOT GATE")
        # self.root.configure(bg=("#081108"))

        # Fonts and Labels
        self.font = ('Arial', 18, 'bold')
        lbl_print = Label(root, text= "A = ", font= ("Arial",20), fg="dark green").place(x=630 , y=400)
        lbl_print = Label(root, text= "Y = ", font= ("Arial",20), fg="dark green").place(x=1070 , y=400)
        lbl_print = Label(root, text= "-: NOT Gate :-", font= ("Arial",40 ,'bold', 'underline'), fg="dark green").place(x=810 , y=50)
        
        
        # Load and display image
        image = Image.open(r"C:\\Users\darsh\\OneDrive - marwadiuniversity.ac.in\Desktop\\code2\\code2\\not_gate.png")  # Update the path to your image
        image = image.resize((280, 230), Image.Resampling.LANCZOS)  # Use LANCZOS for resizing
        self.img = ImageTk.PhotoImage(image)
        self.image_label = tk.Label(self.root, image=self.img)
        self.image_label.place(x=790, y=300)

        # Text fields (only one input needed for NOT gate)
        self.T1 = tk.Entry(self.root, font=self.font, width=5, justify='center')
        self.T1.configure(bg="#4caf50")
        self.T3 = tk.Entry(self.root, font=self.font, width=5, justify='center', state='readonly')  
        self.T3.configure(bg="#4caf50")
        
        

        # Buttons
        self.A1 = tk.Button(self.root, text="Y=Ā\n(Answer)", font=self.font, command=self.calculate_not)
        self.A2 = tk.Button(self.root, text="Exit", font=self.font, command=self.root.quit)
        self.A3 = tk.Button(self.root, text= "↩",font=("Times New Roman", 36 , 'bold'), command=self.go_back)
        self.A1.configure(bg="#00A86B")
        self.A2.configure(bg="#BA8781")
        self.A3.configure(bg="#BA8781")

        # Placing components
        self.T1.place(x=700, y=400)
        self.T3.place(x=1130, y=400)

        self.A1.place(x=830, y=760, width=200, height=100)
        self.A2.place(x=830, y=880, width=200, height=50)
        self.A3.place(x=50, y=50, width=70, height=50)

    def calculate_not(self):
        input1 = self.T1.get()

        if input1 in ['0', '1']:
            result = str(1 - int(input1))  # NOT gate logic
            self.T3.config(state='normal')
            self.T3.delete(0, tk.END)
            self.T3.insert(0, result)
            self.T3.config(state='readonly')
            
        else:
            messagebox.showerror("Invalid Input", "Please enter 0 or 1 only")

    def go_back(self):
        self.root.destroy()  # Close the AND Gate window
        first_page_window = tk.Tk()  # Create a new window
        app = firstpage.LogicGateApp(first_page_window)  # Open the First Page
        first_page_window.mainloop()
if __name__ == "__main__":
    root = tk.Tk()
    app = NOTGateApp(root)
    root.mainloop()