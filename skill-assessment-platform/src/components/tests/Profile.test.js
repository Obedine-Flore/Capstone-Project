jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    // Add any other hooks or components from react-router-dom that you use
}));

import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "../Profile/ProfileSection";

test("renders Profile component", () => {
    render(<Profile />);
    expect(screen.getByText(/Profile Settings/i)).toBeInTheDocument();
});

test("updates user name when input changes", () => {
    render(<Profile />);
    const nameInput = screen.getByLabelText(/Name/i);
    
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    
    expect(nameInput.value).toBe("John Doe");
});
