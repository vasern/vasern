/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const Prism = require("prismjs");

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ""}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : "") + page;
}

class Button extends React.Component {
  render() {
    const { className } = this.props;
    return (
      <div className="pluginWrapper buttonWrapper">
        <a
          className={`button ${className}`}
          href={this.props.href}
          target={this.props.target}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self",
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h1 className="projectTitle">
    Fast and Open Source
    <small>Data storage for React Native</small>
  </h1>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

const QuickCode = () => {
  const code = `
  \`\`\`javascript
  import Vasern from ‘vasern’;

  const VasernDB = new Vasern({
    schemas: [{ 
      name: 'Users',
      props: { name: 'string', age: 'int'}
    }]
  });
  
  VasernDB.Users.onChange(({ changed }) => {
   console.log(changed);
  });
  
  const Peter = VasernDB.Users.insert({
    name: 'Peter Griffin',
    age: 58
  });
  \`\`\`
  `;

  return (
    <div className="hljs__dark">
      <MarkdownBlock>{code}</MarkdownBlock>
    </div>
  );
};

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || "";
    return (
      <SplashContainer>
        <div className="inner block__split">
          <div className="block__col">
            <ProjectTitle />
            <PromoSection>
              {/* <Button href="#try">Quick Start</Button> */}
              <Button
                className="btn-primary"
                href={docUrl("overview.html", language)}
              >
                Getting Started
              </Button>
            </PromoSection>
          </div>
          <QuickCode />
        </div>
      </SplashContainer>
    );
  }
}

const FeatureBlocks = () => {
  const features = [
    {
      id: "native-performance",
      title: "Native storage engine for native performance",
      content: `Address performance issue by getting our hand dirty in C++, Objective-C, Java, 
        to build Vasern storage engine natively. Enable native performance.
      `,
      img: "002-startup.svg",
    },
    {
      id: "zero-dependency",
      title: "Built with thin layers, near zero dependencies",
      content: `Dependencies are great, though it created complex layers that affect the performance.
        Vasern is built with care to reduce as many dependencies as possible. Zero dependency is the goal.
      `,
      img: "003-bag.svg",
      alignRight: true,
    },
    {
      id: "quick-setup",
      title: "Design for simplicity, setup in seconds",
      content: `More works are done underneath to provide a simple APIs.
        Spend less time worrying about databases, more time to build your apps.
      `,
      img: "004-gear.svg",
    },
    {
      id: "open-source",
      title: "Build by developers, for the developer community",
      content: `Vasern is open source and welcome contributions. The abstraction layers let developers easily
        create and use their own plugin.
      `,
      img: "001-group.svg",
      alignRight: true,
    },
  ];
  return (
    <div className="block__feature_details">
      {features.map(item => (
        <div
          className={`block__item${
            item.alignRight ? " block__item_darker" : ""
          }`}
          key={`feature_details_${item.img}`}
        >
          <div
            id={item.id}
            className={`block__container${
              item.alignRight ? " block__row__inverse" : ""
            }`}
          >
            <img height="140" src={imgUrl(item.img)} alt={item.title} />
            <div className="block__content">
              <h3 title="feature__title">{item.title}</h3>
              <p>{item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const Block = props => (
  <Container
    // padding={["bottom", "top"]}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => {
  const appFeatures = [
    {
      // content: "This is the content of my feature",
      image: imgUrl("002-startup.svg"),
      imageAlign: "top",
      title: "Fast",
      link: "native-performance",
    },
    {
      // content: "The content of my second feature",
      image: imgUrl("003-bag.svg"),
      imageAlign: "top",
      title: "Lightweight",
      link: "zero-dependency",
    },
    {
      // content: "The content of my second feature",
      image: imgUrl("004-gear.svg"),
      imageAlign: "top",
      title: "Easy setup",
      link: "quick-setup",
    },
    {
      // content: "The content of my second feature",
      image: imgUrl("001-group.svg"),
      imageAlign: "top",
      title: "Open Source",
      link: "open-source",
    },
  ];

  return (
    <div className="block__features block__split">
      {appFeatures.map(item => (
        <a
          href={`#${item.link}`}
          className="block__item"
          key={`feature_${item.link}`}
        >
          <img src={item.image} alt={`Feature ${item.title}`} />
          <p>{item.title}</p>
        </a>
      ))}
    </div>
  );
};

const TagLine = props => {
  const code = `
  \`\`\`javascript
  import Vasern from 'vasern';

  // Define Todos application schema
  const VasernDB = new Vasern({ 
    schemas: [{
      name: "Users",
      props: {
        fname: "string",
        lname: "string"
      }
    },{
      name: "Todos",
      props: {
        name: "string",
        completed: "boolean",
        assignTo: "#Users"
      }
    }]
  });

  // Add listener whenever Todos has a change (loaded/insert/update/delete)
  VasernDB.Todos.onChange(() => {

    // Get all todo items with "completed = false"
    const todoList = VasernDB.Todos.filter({ completed: false });
    
    // Update state
    this.setState({ data: todoList.data() });
  })
  \`\`\`
  `;

  return (
    <div className="block block__1col">
      <h2 id="try">Delivery quicker with faster performance</h2>
      <p>
        Vasern lets you setup database without any hassle. It was built in the
        native enviroment to achieve native performance.
      </p>
      <MarkdownBlock>{code}</MarkdownBlock>
    </div>
  );
};

const Media = () => (
  <div className="block__article">
    <div className="block block__centered block__nowidth">
      {/* <h2>Vasern on Media</h2> */}
      <div className="block__container">
        {siteConfig.mediaItems.map((item, i) => (
          <div key={`article_${i}`} className="block__item">
            <h4>{item.title}</h4>
            <p className="block__content">{item.description}</p>
            <div className="block__footer">
              { !item.profilePhoto ? null :
                <img src={imgUrl(item.profilePhoto)} alt={item.author} />
              }
              <p>
                <b>{item.author}</b>
                <a href={item.link} alt={item.title}>
                  View on {item.publisher}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: "center" }}
  >
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

const LearnHow = () => (
  <Block background="light">
    {[
      {
        content: "Talk about learning how to use this",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "right",
        title: "Learn How",
      },
    ]}
  </Block>
);

const TryOut = () => (
  <Block id="try">
    {[
      {
        content: "Talk about trying this out",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "left",
        title: "Try it Out",
      },
    ]}
  </Block>
);

const Description = () => (
  <Block background="dark">
    {[
      {
        content: "This is another description of how this project is useful",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "right",
        title: "Description",
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }

  const showcase = siteConfig.users.filter(user => user.pinned).map(user => (
    <a href={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </a>
  ));

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>Who is Using This?</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl("users.html", props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

const NavMessage = () => (
  <p className="block block__1col block__message">
    Available for experimental.
    <a
      href="https://form.jotform.co/82917565387876"
      target="_blank"
      rel="noopener noreferrer"
    >
      {" "}
      Subscribe to receive updates
    </a>
  </p>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || "";

    return (
      <div className="homepage">
        <NavMessage />
        <HomeSplash language={language} />
        <Features />
        <div className="mainContainer">
          <Media />
        </div>
        <FeatureBlocks />
        <div className="mainContainer">
          <PromoSection>
            <Button
              className="btn-primary"
              href={docUrl("overview.html", language)}
            >
              Getting Started
            </Button>
            <Button
              href="https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM"
              target="_blank"
            >
              Join our Slack channel
            </Button>
          </PromoSection>
        </div>
      </div>
    );
  }
}

module.exports = Index;
