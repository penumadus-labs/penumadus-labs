import { useState } from 'react'

const Counter = () => {
  const [fontSize, setFontSize] = useState(130)
  const handleSetFontSize = (n: number) => {
    const newSize = fontSize + n
    setFontSize(newSize)
    document.body.style.fontSize = `${newSize}%`
  }

  const [maxWidth, setMaxWidth] = useState(60)
  const handleSetMaxWidth = (n: number) => {
    const newSize = maxWidth + n
    setMaxWidth(newSize)
    document.styleSheets[1].cssRules[36].style.maxWidth = `${newSize}rem`
  }

  return (
    <>
      <div>
        <p>{fontSize}%</p>
        <button onClick={() => handleSetFontSize(5)}>+</button>
        <button onClick={() => handleSetFontSize(-5)}>-</button>
      </div>
      <div>
        <p>{maxWidth}rem</p>
        <button onClick={() => handleSetMaxWidth(1)}>+</button>
        <button onClick={() => handleSetMaxWidth(-1)}>-</button>
      </div>
      <style jsx>{`
        button {
          padding: 1rem;
          border: 1px solid black;
        }
        p {
          padding-bottom: 0;
        }
      `}</style>
    </>
  )
}

export default function Test() {
  return (
    <div className="content-area">
      <Counter />
      <h1 className="title">Some Content Title</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus
        doloribus officiis molestias iusto vel? Ratione culpa architecto sunt
        veritatis, officiis neque. Porro architecto, aut quas possimus
        distinctio, ullam iure corrupti beatae dolores harum voluptatum nemo
        deserunt error libero officiis, deleniti odit ratione optio eos
        consequuntur molestiae unde ea dolore iusto. Itaque, harum suscipit! Cum
        obcaecati eos aperiam repudiandae soluta quas alias explicabo aliquam
        iure sapiente officia inventore, officiis adipisci. Incidunt, ad nihil
        molestias quod itaque provident praesentium, omnis quia nostrum
        asperiores eveniet reiciendis adipisci fugiat est quam voluptas cum
        perferendis ducimus quidem voluptatum rerum neque, placeat illo.
        Consequuntur, vitae molestiae. Voluptate architecto tempore pariatur
        corporis ipsum omnis neque odit vitae distinctio adipisci quibusdam,
        modi nihil dolores eaque beatae ullam assumenda dolor provident saepe
        porro velit cumque, ratione sint dolore. Ad, quo nobis harum dolor
        explicabo culpa in dignissimos saepe non minima autem, voluptatum
        corrupti velit accusantium ab recusandae qui quibusdam cum ducimus,
        debitis quos labore voluptates sapiente! Blanditiis labore veniam itaque
        consectetur expedita, odio culpa obcaecati voluptate voluptatum dicta,
        quas ducimus maiores aperiam rerum! Blanditiis debitis laboriosam
        pariatur, adipisci fugit quisquam asperiores minima nobis. Ipsum
        laudantium odio ea maxime fugiat minima cupiditate! Dicta quisquam
        ducimus laudantium, recusandae velit, similique modi nulla quas eveniet
        dolorem repudiandae, quidem nesciunt rem reprehenderit soluta voluptas
        tempore commodi ullam expedita dolor ipsum et. A soluta dolor distinctio
        ratione deserunt eligendi quo, repudiandae nulla quis, ea perferendis
        sint at. Rerum dicta distinctio perferendis? Voluptates, ex
        necessitatibus neque quaerat hic voluptatibus cum omnis. Laudantium
        fugiat obcaecati delectus distinctio non fuga earum corporis repellat
        atque illo? Exercitationem nobis voluptate blanditiis sequi illum ab
        fugiat natus temporibus. Voluptate libero, dolore fugiat non quos saepe
        accusamus animi vel aut culpa illo dolores eveniet ab aperiam dolorem.
        Nostrum maiores delectus, dolores voluptatem consectetur accusamus culpa
        nihil dignissimos laborum minus quod, cum accusantium, modi ipsa nulla
        adipisci! Illo dolores pariatur qui aut maxime! Odio voluptas sequi
        voluptates earum neque maxime enim est fugiat. Perferendis iusto commodi
        modi adipisci, excepturi corrupti doloribus? Ipsum, aliquam. Perferendis
        odit tempore, exercitationem a qui id aperiam voluptatum suscipit,
        itaque voluptate repellat consequatur molestias est rem natus.
        Doloremque odit impedit atque est modi inventore quasi quo veritatis,
        debitis dolore doloribus dolores autem quis eos sed officiis cumque cum
        hic necessitatibus. Quod voluptatum iure culpa tempora ipsum similique
        quaerat tenetur totam maiores. Nostrum odio ut commodi atque expedita
        blanditiis! Dicta quo, pariatur recusandae temporibus dolorem delectus
        officiis est maxime molestias rem quas laboriosam itaque dolor
        laudantium porro beatae laborum saepe, ducimus adipisci explicabo eius
        optio, neque praesentium nulla! Iste error natus consequatur obcaecati.
        Laudantium minus ad reprehenderit nemo exercitationem omnis officiis
        cupiditate dolorum quod esse ducimus tenetur ea similique perferendis,
        hic dolorem labore ut officia. Reprehenderit blanditiis dolorem facilis
        quaerat repudiandae quis quod harum natus exercitationem, ipsa,
        aspernatur hic nulla ducimus possimus aperiam odio, expedita tempore
        rerum sequi eligendi tenetur suscipit magni dolore ipsum. Sequi ab
        dolores tenetur dolorum necessitatibus? Voluptatem, quisquam modi. Amet
        quo eaque quod, excepturi, harum, culpa veritatis nulla tempore vitae
        animi facere beatae nisi! Quae.
      </p>
    </div>
  )
}
