//DefaultLayout
import { Link } from "react-router-dom";

interface DefaultLayoutProps{
    children: React.ReactNode;
}
export default function DefaultLayout({children} : DefaultLayoutProps){
    return(
        <>
        <header>
            <nav>
                <ul>
                    <li><Link to ="/home">Home</Link></li>
                    <li><Link to ="/contact">Contact</Link></li>
                    <li><Link to ="/overview">Overview</Link></li>
                    
                </ul>
            </nav>
        </header>
        <main>
            {children}
        </main>
        </>
    );
}