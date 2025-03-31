import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Blog() {
    const categories = ["All", "Technology", "Business", "Science", "Sports"];

    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedArticle, setExpandedArticle] = useState(null);

    useEffect(() => {
        fetch(
            "https://newsapi.org/v2/everything?q=tesla&from=2025-02-28&sortBy=publishedAt&apiKey=8ca9bc5bdc014697a6110ddb322ab8b4"
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.articles) {
                    setArticles(data.articles);
                    setFilteredArticles(data.articles);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filterByCategory = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredArticles(articles);
        } else {
            setFilteredArticles(
                articles.filter((article) =>
                    article.title?.toLowerCase().includes(category.toLowerCase()) ||
                    article.description?.toLowerCase().includes(category.toLowerCase())
                )
            );
        }
    };

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-light bg-light mb-4 p-3 rounded">
                <a className="navbar-brand fw-bold" href="#">
                    Blog
                </a>
                <div>
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`btn me-2 ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => filterByCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="row">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card h-100">
                                {article.urlToImage && (
                                    <img src={article.urlToImage} className="card-img-top" alt={article.title} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{article.title}</h5>
                                    <p className="card-text">
                                        {article.description ? article.description.slice(0, 100) + "..." : "No description available."}
                                    </p>
                                    <button className="btn btn-primary" onClick={() => setExpandedArticle(index)}>
                                        View More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No articles available.</p>
                )}
            </div>

            {expandedArticle !== null && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{filteredArticles[expandedArticle].title}</h5>
                                <button type="button" className="btn-close" onClick={() => setExpandedArticle(null)}></button>
                            </div>
                            <div className="modal-body">
                                {filteredArticles[expandedArticle].urlToImage && (
                                    <img
                                        src={filteredArticles[expandedArticle].urlToImage}
                                        className="img-fluid mb-3"
                                        alt={filteredArticles[expandedArticle].title}
                                    />
                                )}
                                <p>{filteredArticles[expandedArticle].content}</p>
                                <a href={filteredArticles[expandedArticle].url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                                    Read Full Article
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blog;
