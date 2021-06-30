import Head from 'next/head';

export default function LayoutsPage() {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://unpkg.com/carbon-components/css/carbon-components.min.css"/>
      </Head>
      
      <h1>Grid Layout Examples</h1>
      <p>Below are some simple examples intended to be an entrypoint into using the Carbon CSS Grid</p>

      <h2>Wide (default)</h2>
      <article className="example">
        <section className="bx--css-grid">
          <div className="bx--col-span-4">
            <p>Title</p>
          </div>
          <div className="bx--col-span-4">
            <p>Title</p>
          </div>
          <div className="bx--col-span-4">
            <p>Title</p>
          </div>
          <div className="bx--col-span-4">
            <p>Title</p>
          </div>
        </section>
      </article>

      <h2>Wide (12 column)</h2>
      <article className="example">
        <section className="bx--css-grid--12">
          <div className="bx--col-span-4">
          <p>Some text</p>
          </div>
          <div className="bx--col-span-4">
            <p>Some text</p>
          </div>
          <div className="bx--col-span-4">
            <p>Some text</p>
          </div>
        </section>
      </article>

      <h2>Narrow</h2>
      <article className="example">
        <section className="bx--css-grid bx--css-grid--narrow">
        {/* <UnorderedList className="bx--col-span-100 bx--gutter-start">
        <ListItem>All columns get a negative margin, a 'hang by default', placing the left edge of the container in the gutter.</ListItem>
        <ListItem>Text must manually be given an additional .bx--gutter-start class applying padding-left to align text the column definition.</ListItem>
        <ListItem>Container elements should have padding built in (like Tile) so that type aligns as expected.</ListItem>
      </UnorderedList> */}
          <div className="bx--col-span-25">
            <p className="bx--gutter-start">Some text</p>
          </div>
          <div className="bx--col-span-25">
            <p className="bx--gutter-start">Some text</p>
          </div>
          <div className="bx--col-span-25">
            <p className="bx--gutter-start">Some text</p>
          </div>
          <div className="bx--col-span-25">
            <p className="bx--gutter-start">Some text</p>
          </div>
        </section>
      </article>

      <h2>Condensed</h2>
      <article className="example">
        <section className="bx--css-grid bx--css-grid--condensed">
          <div className="bx--col-span-25">
            <p>Some text</p>
          </div>
          <div className="bx--col-span-25">
            <p>Some text</p>
          </div>
          <div className="bx--col-span-25">
            <p>Some text</p>
          </div>
          <div className="bx--col-span-25">
            <p>Some text</p>
          </div>
          <div className="bx--col-span-50">
            {/* <Tile>The row-gap property provides consistent vertical guttering</Tile> */}
          </div>
          <div className="bx--col-span-50">
          {/* <Tile>The row-gap property provides consistent vertical guttering</Tile> */}
          </div>
        </section>
      </article>

      <h2>Wide parent grid, Wide & Narrow children <span className="subgrid">subgrids</span></h2>
      <article className="example">
        <section className="bx--css-grid">
          <div className="bx--col-span-4">
            <p>Wide</p>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid--narrow">
            <div className="bx--col-span-100">
              <p className="bx--gutter-start">Narrow</p>
            </div>
          </div>
        </section>
      </article>

      <h2>Wide parent grid, Wide & Condensed children <span className="subgrid">subgrids</span></h2>
      <article className="example">
        <section className="bx--css-grid">
          <div className="bx--col-span-4">
            <p>Wide</p>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid--condensed">
            <div className="bx--col-span-100">
              <p>Condensed</p>
            </div>
          </div>
        </section>
      </article>


      <h2>Wide parent grid, Narrow & Condensed children <span className="subgrid">subgrids</span></h2>
      <article className="example">
        <section className="bx--css-grid">
          <div className="bx--col-span-4 bx--subgrid bx--css-grid--narrow">
            <div className="bx--col-span-100">
              <p className="bx--gutter-start">Narrow</p>
            </div>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid--condensed">
            <div className="bx--col-span-100">
              <p>Condensed</p>
            </div>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid--condensed">
            <div className="bx--col-span-100">
              <p>Condensed</p>
            </div>
          </div>
          <div className="bx--col-span-4 bx--subgrid bx--css-grid--narrow">
            <div className="bx--col-span-100">
              <p className="bx--gutter-start">Narrow</p>
            </div>
          </div>
        </section>
      </article>


      <h2>Narrow parent grid, Wide & Condensed children <span className="subgrid">subgrids</span></h2>
      <article className="example">
        <section className="bx--css-grid bx--css-grid--narrow">
          <div className="bx--col-span-4 bx--subgrid bx--css-grid">
            <div className="bx--col-span-100">
              <p>Wide subgrid</p>
            </div>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid--condensed">
            <div className="bx--col-span-100">
              <p>Condensed subgrid</p>
            </div>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid--condensed">
            <div className="bx--col-span-100">
              <p>Condensed subgrid</p>
            </div>
          </div>
          <div className="bx--col-span-4 bx--subgrid bx--css-grid">
            <div className="bx--col-span-100">
              <p>Wide subgrid</p>
            </div>
          </div>
        </section>
      </article>

      <h2>Condensed parent grid, Narrow & Wide children <span className="subgrid">subgrids</span></h2>
      <article className="example">
        <section className="bx--css-grid bx--css-grid--condensed">
          <div className="bx--col-span-4 bx--subgrid bx--css-grid--narrow">
            <div className="bx--col-span-100">
              <p className="bx--gutter-start">Narrow subgrid</p>
            </div>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid">
            <div className="bx--col-span-100">
              <p>Wide subgrid</p>
            </div>
          </div>
          <div className="bx--col-span-12 bx--subgrid bx--css-grid">
            <div className="bx--col-span-100">
              <p>Wide subgrid</p>
            </div>
          </div>
          <div className="bx--col-span-4 bx--subgrid bx--css-grid--narrow">
            <div className="bx--col-span-100">
              <p className="bx--gutter-start">Narrow subgrid</p>
            </div>
          </div>
        </section>
      </article>

      <h2>How deep can we nest?</h2>
      <article className="example">
        <section className="bx--css-grid">

          <div className="bx--col-span-50 bx--subgrid">
            <div className="content bx--col-span-100">
                <p>50% width subgrid configured with col-span-percent classes (This can only have 2 subgrids. grid -> subgrid -> subgrid)</p>
                <div className="bx--col-span-100 bx--subgrid">
                  <div className="content bx--col-span-25"><p>50% second level subgrid</p></div>
                  <div className="content bx--col-span-25"><p>50% second level subgrid</p></div>
                </div>
            </div>
          </div>

          <div className="bx--col-span-8 bx--subgrid">
            <div className="content bx--col-span-8">
                <p>8 column subgrid, configured with col-span classes</p>
                <div className="bx--col-span-8 bx--subgrid">
                  <div className="content bx--col-span-4">second subgrid, 2 columns wide</div>
                  <div className="content bx--col-span-4">second subgrid, 2 columns wide</div>
                </div>

                <div className="bx--col-span-8 bx--subgrid">
                  <div className="bx--col-span-100">
                    <p>second subgrid, 8 columns wide</p>
                    <div className="bx--col-span-4 bx--subgrid">
                      <div className="content bx--col-span-2">
                        <p>third subgrid, 4 columns wide</p>
                        <div className="bx--col-span-4 bx--subgrid">
                          <div className="content bx--col-span-1">fourth subgrid</div>
                        </div>
                      </div>
                      <div className="content bx--col-span-2 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                        <div className="content bx--col-span-100 bx--subgrid">
                          Technically, infinitely
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
