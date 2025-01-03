import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground">
              The Dean Goldsteen Directory helps performers find open mic events
              in their area.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: deangoldsteen@yahoo.com
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.tiktok.com/@deangoldsteen"
                  className="text-muted-foreground hover:text-foreground"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Dean Goldsteen. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
