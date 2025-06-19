'use client'
export default function Breadcrumb({path,setPath}){
    const segments = path.split('/').filter(Boolean)      // ['folder','sub']
    const crumbs   = ['root', ...segments]

    function click(index){
        const newPath = index===0 ? '' : segments.slice(0,index).join('/')+'/'
        setPath(newPath)
    }

    return (
        <nav className="text-sm mb-2">
            {crumbs.map((c,i)=>(
                <span key={i}>
          <button onClick={()=>click(i)}
                  className="text-blue-400 hover:underline">
            {c}
          </button>
                    {i<crumbs.length-1 && ' / '}
        </span>
            ))}
        </nav>
    )
}
