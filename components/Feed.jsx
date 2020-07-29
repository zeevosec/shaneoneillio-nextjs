import React, { Component } from "react";
import Post from "./Post";

const FilterButton = (props) => {
  const className = `post-single__tags-list-item-link filterbtn${
    props.first ? " ml-0" : ""
  }`;
  return (
    <button type="button" onClick={props.onClick} className={className}>
      {props.tag}
    </button>
  );
};

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: this.props.posts,
    };
    const category = this.props.posts.map(
      (post) => post.node.frontmatter.category
    );
    this.state.category = category.filter((v, i) => category.indexOf(v) === i);
  }

  filterByCategory(category) {
    this.setState({
      filtered: this.props.posts.filter(
        (post) => post.node.frontmatter.category === category
      ),
    });
  }

  render() {
    return (
      <div className="content__inner">
        <ul className="post-single__tags-list">
          <li className="post-single__tags-list">
            <FilterButton
              tag="All"
              onClick={() => this.setState({ filtered: this.props.posts })}
              first
            />
            {this.state.category.map((category) => (
              <FilterButton
                onClick={() => this.filterByCategory(category)}
                tag={category}
              />
            ))}
          </li>
        </ul>
        {this.state.filtered.map((post) => (
          <Post data={post} key={post.node.fields.slug} />
        ))}
      </div>
    );
  }
}

export default Feed;
