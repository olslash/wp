import { takeWhile, compact } from 'lodash'
import React from 'react'
// import { Link } from 'react-router'
export default class HomeView extends React.Component {
  static propTypes = {

  };

  state = {
    containerWidth: 0
  };

  componentDidMount () {
    this.setState({
      containerWidth: this.refs.container.offsetWidth
    })

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.setState({
      containerWidth: this.refs.container.offsetWidth
    })
  };

  getRows (images, idealRowHeight) {
    let cursor = 0

    const rows = images.map(() => {
      let currentRowWidth = 0

      const row = takeWhile(images.slice(cursor), (image) => {
        const scaledImageWidth = idealRowHeight * aspectRatio(image)
        const newRowWidth = currentRowWidth + scaledImageWidth

        // reject images that would push this row over the max width
        if (newRowWidth > this.state.containerWidth) {
          return false
        }

        cursor += 1
        currentRowWidth = newRowWidth
        return true
      })

      return row.length > 0 ? row : null
    })

    return compact(rows)
  }

  getRowWidth (row, idealRowHeight) {
    return row.reduce((width, image) => {
      const scaledWidth = idealRowHeight * aspectRatio(image)

      return width + scaledWidth
    }, 0)
  }

  render () {
    const idealRowHeight = 200
    const rows = this.getRows(images, idealRowHeight)

    return (
      <div className=''
           ref='container'>
        {
          rows.map(row => {
            const rowAspectRatio = aspectRatio({
              width: this.getRowWidth(row, idealRowHeight),
              height: idealRowHeight
            })

            // need to stay 1 pixel away from container edge to prevent browser reflow issues
            const scaledRowHeight = (this.state.containerWidth - 1) / rowAspectRatio

            return row.map(image => {
              const scaledWidth = scaledRowHeight * aspectRatio(image)

              return (
                <img src={ image.src }
                     width={ scaledWidth }
                     height={ scaledRowHeight }/>
              )
            })
          })
        }
      </div>
    )
  }
}

function requireAll (r) {
  return r.keys().map(r)
}

const images = requireAll(require.context(
  '../../static/images',
  true, // include subdirectories
  /\.(png|jpg|jpeg)$/
))

function aspectRatio ({width, height}) {
  return width / height
}
