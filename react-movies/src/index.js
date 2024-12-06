import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MovieDetailsPage";
import FavoriteMoviesPage from "./pages/FavoriteMoviesPage";
import MovieReviewPage from "./pages/MovieReviewPage";
import SiteHeader from './components/siteHeader'
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from './pages/addMovieReviewPage'
import UpcomingMoviesPage from "./pages/UpcomingMoviesPage";
import NowPlayingMoviesPage from "./pages/NowPlayingMoviesPage";
import Error404 from "./pages/Error404";
import Error400 from "./pages/Error400";
import MovieCreditsPage from "./pages/MovieCreditsPage";
import MovieRecommendationsPage from "./pages/MovieRecommendationPage";
import PersonDetailPage from "./pages/PersonDetailPage";
import PaginationContextProvider from "./contexts/paginationContext";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import UserContextProvider from "./contexts/userContext";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <BrowserRouter>
          <SiteHeader />
          <PaginationContextProvider>
            <MoviesContextProvider>
              <Routes>
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/reviews/form" element={<AddMovieReviewPage />} />
                <Route path="/movies/favorites" element={<FavoriteMoviesPage />} />
                <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
                <Route path="/movies/nowplaying" element={<NowPlayingMoviesPage />} />
                <Route path="/reviews/:id" element={<MovieReviewPage />} />
                <Route path="/movies/:id/credits" element={<MovieCreditsPage />} />
                <Route path="/movies/:id/recommendations" element={<MovieRecommendationsPage />} />
                <Route path="/movies/:id" element={<MoviePage />} />
                <Route path="/person/:id" element={<PersonDetailPage />} />
                <Route path="/" element={<HomePage />} />
                {/* <Route path="*" element={<Navigate to="/" />} /> */}
                <Route path="/err" element={<Error400 />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </MoviesContextProvider>
          </PaginationContextProvider>
        </BrowserRouter>
      </UserContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const rootElement = createRoot(document.getElementById("root"))
rootElement.render(<App />);
