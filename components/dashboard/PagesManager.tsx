// src/components/dashboard/PagesManager.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { collection, getDocs, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import Image from 'next/image';
import type { Product } from '../../types/product';

interface PagesManagerProps {
  onSave?: (updates: PageUpdate[]) => void;
}

interface PageUpdate {
  productId: string;
  page: number;
}

interface PageGroup {
  page: number;
  products: Product[];
}

export default function PagesManager({ onSave }: PagesManagerProps) {
  const [pages, setPages] = useState<PageGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedProducts, setChangedProducts] = useState<Map<string, number>>(new Map());
  const [successMessage, setSuccessMessage] = useState('');

  // Load all products grouped by page
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'products'), orderBy('page', 'asc'));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Group by page
      const pageMap = new Map<number, Product[]>();
      const unassigned: Product[] = [];

      products.forEach(product => {
        const page = product.page || 0;
        if (page === 0) {
          unassigned.push(product);
        } else {
          if (!pageMap.has(page)) pageMap.set(page, []);
          pageMap.get(page)!.push(product);
        }
      });

      // Sort pages
      const sortedPages = Array.from(pageMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([page, prods]) => ({ page, products: prods }));

      // Add unassigned as page 0
      if (unassigned.length > 0) {
        sortedPages.unshift({ page: 0, products: unassigned });
      }

      setPages(sortedPages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag end
  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newPages = [...pages];
    const sourcePageIndex = newPages.findIndex(p => `page-${p.page}` === source.droppableId);
    const destPageIndex = newPages.findIndex(p => `page-${p.page}` === destination.droppableId);

    if (sourcePageIndex === -1 || destPageIndex === -1) return;

    const sourcePage = { ...newPages[sourcePageIndex], products: [...newPages[sourcePageIndex].products] };
    const destPage = sourcePageIndex === destPageIndex ? sourcePage : { ...newPages[destPageIndex], products: [...newPages[destPageIndex].products] };

    // Remove from source
    const [movedProduct] = sourcePage.products.splice(source.index, 1);
    
    // Add to destination
    destPage.products.splice(destination.index, 0, movedProduct);

    newPages[sourcePageIndex] = sourcePage;
    if (sourcePageIndex !== destPageIndex) {
      newPages[destPageIndex] = destPage;
    }

    // Remove empty pages (except page 0)
    const filteredPages = newPages.filter(p => p.page === 0 || p.products.length > 0);

    setPages(filteredPages);

    // Track changes
    const newChangedProducts = new Map(changedProducts);
    const destPageNumber = parseInt(destination.droppableId.replace('page-', ''));
    newChangedProducts.set(movedProduct.id, destPageNumber);
    setChangedProducts(newChangedProducts);
    setHasChanges(true);
  }, [pages, changedProducts]);

  // Save changes - only update changed products
  const handleSave = async () => {
    if (changedProducts.size === 0) return;

    try {
      setSaving(true);
      const batch = writeBatch(db);

      changedProducts.forEach((newPage, productId) => {
        const productRef = doc(db, 'products', productId);
        batch.update(productRef, { page: newPage });
      });

      await batch.commit();
      
      setChangedProducts(new Map());
      setHasChanges(false);
      setSuccessMessage(`${changedProducts.size} produit(s) mis à jour`);
      
      if (onSave) {
        const updates: PageUpdate[] = [];
        changedProducts.forEach((page, productId) => {
          updates.push({ productId, page });
        });
        onSave(updates);
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Add a new empty page
  const addPage = () => {
    const maxPage = pages.reduce((max, p) => Math.max(max, p.page), 0);
    setPages([...pages, { page: maxPage + 1, products: [] }]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Gestion des Pages</h2>
          <p className="text-sm text-steel-dark mt-1">
            Glissez-déposez les produits pour les organiser par page
          </p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && (
            <span className="text-sm text-green-600 font-medium">{successMessage}</span>
          )}
          <button onClick={addPage} className="btn-secondary text-sm">
            + Nouvelle page
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : `Enregistrer (${changedProducts.size})`}
          </button>
        </div>
      </div>

      {/* Pages */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pages.map((pageGroup) => (
            <div key={pageGroup.page} className="card-dashboard overflow-hidden">
              {/* Page Header */}
              <div className="bg-navy-main text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold">
                  {pageGroup.page === 0 ? 'Non classés' : `Page ${pageGroup.page}`}
                </h3>
                <span className="text-sm text-white/70">
                  {pageGroup.products.length} produit{pageGroup.products.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Products List */}
              <Droppable droppableId={`page-${pageGroup.page}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 space-y-2 min-h-[100px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-beige-warm/50' : ''
                    }`}
                  >
                    {pageGroup.products.length === 0 ? (
                      <div className="text-center py-8 text-steel-dark text-sm">
                        Déposez des produits ici
                      </div>
                    ) : (
                      pageGroup.products.map((product, index) => (
                        <Draggable key={product.id} draggableId={product.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-3 p-2 rounded-lg border bg-white transition-shadow ${
                                snapshot.isDragging
                                  ? 'shadow-xl border-navy-accent'
                                  : 'border-steel hover:shadow-md'
                              }`}
                            >
                              {/* Product Image */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-steel flex-shrink-0">
                                {(product.images?.[0]?.url || product.imageExternalLinks?.[0]) ? (
                                  <img
                                    src={product.images?.[0]?.url || product.imageExternalLinks?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-steel-dark">
                                  {product.category} {product.brand ? `• ${product.brand}` : ''}
                                </p>
                              </div>

                              {/* Drag Handle */}
                              <div className="text-steel-dark cursor-grab active:cursor-grabbing">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}