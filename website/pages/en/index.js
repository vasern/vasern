/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const Prism = require('prismjs');

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    let { className } = this.props;
    return (
      <div className={`pluginWrapper buttonWrapper`}>
        <a className={`button ${className}`} href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
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
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h1>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="#try">Quick Start</Button>
            <Button className="btn-primary" href={docUrl('overview.html', language)}>Documentation</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => (
  <Block layout="fourColumn">
    {[
      {
        content: 'This is the content of my feature',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: 'Feature One',
      },
      {
        content: 'The content of my second feature',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: 'Feature Two',
      },
    ]}
  </Block>
);

const TagLine = (props) => {
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

  return <div className="block block__1col">
    <h2 id="try">Delivery quicker with faster performance</h2>
    <p>Vasern lets you setup database without any hassle. It was built in the native enviroment 
    to achieve native performance.</p>
    <MarkdownBlock>
        {code}
    </MarkdownBlock>
  </div>
}

const Media = () => {
  return <div className="block__article">
    <div className="block block__centered">
      <h2>Vasern on Media</h2>
      <div className="block__container">
        { siteConfig.mediaItems.map((item,i) =>
          <div key={`article_${i}`} className="block__item">
            <h4>{ item.title }</h4>
            <p className="block__content">{ item.description }</p>
            <p className="block__footer">{ item.author } - <a href={item.link} alt={item.title}>View on { item.publisher }</a></p>
          </div>
        )}
      </div>
    </div>
  </div>
}

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{textAlign: 'center'}}>
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

const LearnHow = () => (
  <Block background="light">
    {[
      {
        content: 'Talk about learning how to use this',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Learn How',
      },
    ]}
  </Block>
);

const TryOut = () => (
  <Block id="try">
    {[
      {
        content: 'Talk about trying this out',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'left',
        title: 'Try it Out',
      },
    ]}
  </Block>
);

const Description = () => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Description',
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
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {

  render() {
    const language = this.props.language || '';

    return (
      <div className="homepage">
        <HomeSplash language={language} />
        <div className="mainContainer">
          <p className="block block__1col block__message">
            Vasern is now available in iOS for experimental.
            <br/>
            <a href="https://form.jotform.co/82917565387876" target="_blank" >Subscribe to Vasern for updates </a> (with 2 optional survey questions)
          </p>
          <TagLine />
          <Media />
          
          <PromoSection>
            <Button className="btn-primary" href={docUrl('overview.html', language)}>Getting Started</Button>
            <Button href="https://join.slack.com/t/vasern/shared_invite/enQtNDU4NTk2MDI5OTcyLTRiYzRjZDI5YTAyMjlhYzg1YTdhNjFjZGNkODI1OTQwYzExZjA3NWRkYTY1MGE2ZjU0YzU3NzE2NzUwZmEwMjM" target="_blank">Join our Slack channel</Button>
          </PromoSection>
          {/*
            <Features />
            <FeatureCallout />
            <LearnHow />
            <TryOut />
            <Description />
            <Showcase language={language} />
          */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
