import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import { artistPagination, getArtistCount } from "../../apis/Api";

// Mock API functions
jest.mock("../../apis/Api");

const mockArtists = {
  data: {
    artists: [
      { _id: "1", name: "Artist 1", artistRate: 100, artistDescription: "Description 1" },
      { _id: "2", name: "Artist 2", artistRate: 200, artistDescription: "Description 2" },
    ],
  },
};

const mockArtistCount = {
  data: {
    artistCount: 16,
  },
};

describe("Homepage Component Tests", () => {
  beforeEach(() => {
    artistPagination.mockResolvedValue(mockArtists);
    getArtistCount.mockResolvedValue(mockArtistCount);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the homepage", async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Available Artists")).toBeInTheDocument();
    });
  });

  it("should display artist names", async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Artist 1")).toBeInTheDocument();
      expect(screen.getByText("Artist 2")).toBeInTheDocument();
    });
  });

  it("should handle search input", async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Search artists..."), { target: { value: "Artist 1" } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search artists...").value).toBe("Artist 1");
    });
  });

  it("should call artistPagination on search", async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Search artists..."), { target: { value: "Artist 1" } });
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(artistPagination).toHaveBeenCalledWith(1, 8, "Artist 1", "asc", "name");
    });
  });

  it("should sort artists by price (low to high)", async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Sort by:"), { target: { value: "asc" } });

    await waitFor(() => {
      expect(artistPagination).toHaveBeenCalledWith(1, 8, "", "asc", "name");
    });
  });

  it("should sort artists by price (high to low)", async () => {
    render(
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Sort by:"), { target: { value: "desc" } });

    await waitFor(() => {
      expect(artistPagination).toHaveBeenCalledWith(1, 8, "", "desc", "name");
    });
  });

  

  

});
