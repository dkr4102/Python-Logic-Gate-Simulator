import tkinter as tk
import firstpage
from tkinter import Label, messagebox
from PIL import Image, ImageTk  # Make sure you have the pillow library installed

class ANDGateApp:
    def __init__(self, root):
        
        self.root = root
        width = self.root.winfo_screenwidth()
        height = self.root.winfo_screenheight()
        self.root.geometry(f"{width}x{height}")
        self.root.title("AND GATE")
        # self.root.configure(bg=("very dark lime green"))


        # Fonts and Labels
        self.font = ('Arial', 18, 'bold')
        lbl_print = Label(root, text= "A = ", font= ("Arial",20), fg="dark green").place(x=630 , y=355)
        lbl_print = Label(root, text= "B = ", font= ("Arial",20), fg="dark green").place(x=630 , y=425)
        lbl_print = Label(root, text= "Y = ", font= ("Arial",20), fg="dark green").place(x=1175 , y=390)
        lbl_print = Label(root, text= "-: AND Gate :-", font= ("Arial",40 ,'bold', 'underline'), fg="dark green").place(x=810 , y=50)
        

        # Load and display image
        image = Image.open(r"C:\\Users\darsh\\OneDrive - marwadiuniversity.ac.in\Desktop\\code2\\code2\\and_gate.png")  # Update the path to your image
        image = image.resize((350, 230), Image.Resampling.LANCZOS)  # Use LANCZOS for resizing
        self.img = ImageTk.PhotoImage(image)
        self.image_label = tk.Label(self.root, image=self.img)
        self.image_label.place(x=790, y=295)

        # Text fields
        self.T1 = tk.Entry(self.root, font=self.font, width=5, justify='center')
        self.T2 = tk.Entry(self.root, font=self.font, width=5, justify='center')
        self.T3 = tk.Entry(self.root, font=self.font, width=5, justify='center', state='readonly')

        # Buttons
        self.A1 = tk.Button(self.root, text="Y= A * B\n(Answer)", font=self.font, command=self.calculate_and)
        self.A2 = tk.Button(self.root, text="Exit", font=self.font, command=self.root.quit)
        self.A3 = tk.Button(self.root, text= "↩",font=("Times New Roman", 36 , 'bold'), command=self.go_back)
        self.A1.configure(bg="#00A86B")
        self.A2.configure(bg="#BA8781")
        self.A3.configure(bg="#BA8781")


        # Placing components
        self.T1.place(x=690, y=360)
        self.T1.configure(bg=("#4caf50"))
        self.T2.place(x=690, y=430)
        self.T2.configure(bg=("#4caf50"))
        self.T3.place(x=1255, y=390)
        self.T3.configure(bg=("#A3AFC4"))

        self.A1.place(x=830, y=760, width=200, height=100)
        self.A2.place(x=830, y=880, width=200, height=50)
        self.A3.place(x=50, y=50, width=70, height=50)


    def calculate_and(self):
        input1 = self.T1.get()
        input2 = self.T2.get()

        if input1 in ['0', '1'] and input2 in ['0', '1']:
            result = str(int(input1) & int(input2))  # AND gate logic
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
    app = ANDGateApp(root)
    root.mainloop()


